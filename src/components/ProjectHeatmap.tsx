import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Project, UserProfile } from '../types';
import { Activity, ShieldAlert, Sparkles, CheckSquare, RefreshCw, Layers } from 'lucide-react';

interface ProjectHeatmapProps {
  projects: Project[];
  currentUser: UserProfile;
  onValidateTile: (projectId: string, count: number, cipherText: string) => Promise<void>;
}

interface HeatmapTile {
  id: string;
  row: number;
  col: number;
  status: 'untouched' | 'mapped' | 'validated' | 'high-activity';
  activity: number;
  mappersCount: number;
  pendingEdits: number;
  blockName: string;
}

export default function ProjectHeatmap({ projects, currentUser, onValidateTile }: ProjectHeatmapProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [hoveredTile, setHoveredTile] = useState<HeatmapTile | null>(null);
  const [selectedTile, setSelectedTile] = useState<HeatmapTile | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Generate grids based on selected project's validation/mapping ratios
  const generateGridData = (project: Project): HeatmapTile[] => {
    if (!project) return [];
    
    const rows = 8;
    const cols = 12;
    const totalTiles = rows * cols;
    const tiles: HeatmapTile[] = [];

    // Derive tile counts based on validation state
    const goldCount = Math.round((project.validatedTasks / project.totalTasks) * totalTiles);
    const mappedCount = Math.round(((project.mappedTasks - project.validatedTasks) / project.totalTasks) * totalTiles);
    const untouchedCount = totalTiles - goldCount - mappedCount;

    // Build grid
    let goldRegistered = 0;
    let mappedRegistered = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        const alphabet = String.fromCharCode(65 + r); // A, B, C...
        const blockName = `${alphabet}-${c + 1}`;
        
        let status: 'untouched' | 'mapped' | 'validated' | 'high-activity' = 'untouched';
        let activity = 0;
        let mappersCount = 0;
        let pendingEdits = 0;

        // Populate statuses deterministically seeded by coordinate index
        const pseudoRandom = Math.sin(index + (project.projectId.charCodeAt(0) || 5)) * 0.5 + 0.5;
        
        if (index < goldCount) {
          status = 'validated';
          activity = Math.round(10 + pseudoRandom * 20);
          mappersCount = pseudoRandom > 0.6 ? 2 : 1;
        } else if (index < goldCount + mappedCount) {
          // Some mapped tiles are designated as "high-activity needs immediate validation"
          const isHighActivity = pseudoRandom > 0.65;
          status = isHighActivity ? 'high-activity' : 'mapped';
          
          activity = isHighActivity ? Math.round(75 + pseudoRandom * 25) : Math.round(35 + pseudoRandom * 30);
          mappersCount = isHighActivity ? Math.round(3 + pseudoRandom * 3) : Math.round(1 + pseudoRandom * 2);
          pendingEdits = isHighActivity ? Math.round(25 + pseudoRandom * 40) : Math.round(5 + pseudoRandom * 15);
        } else {
          status = 'untouched';
          activity = pseudoRandom > 0.8 ? Math.round(5 + pseudoRandom * 10) : 0;
          mappersCount = pseudoRandom > 0.8 ? 1 : 0;
        }

        tiles.push({
          id: `tile-${project.id}-${r}-${c}`,
          row: r,
          col: c,
          status,
          activity,
          mappersCount,
          pendingEdits,
          blockName
        });
      }
    }
    return tiles;
  };

  const gridData = generateGridData(selectedProject);

  // Render heatmap visualization using D3
  useEffect(() => {
    if (!svgRef.current || !selectedProject || gridData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawings

    const width = 640;
    const height = 360;
    const margin = { top: 25, right: 15, bottom: 25, left: 35 };

    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("width", "100%")
       .attr("height", "100%");

    const rows = 8;
    const cols = 12;

    const gridWidth = width - margin.left - margin.right;
    const gridHeight = height - margin.top - margin.bottom;

    const cellWidth = gridWidth / cols;
    const cellHeight = gridHeight / rows;

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    // D3 Scales for Labels
    const colLabels = Array.from({ length: cols }, (_, i) => `${i + 1}`);
    const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));

    // Render Background Grid Guidelines
    g.selectAll(".grid-line")
     .data(colLabels)
     .enter()
     .append("line")
     .attr("class", "grid-line opacity-10 dark:opacity-5")
     .attr("x1", (d, i) => i * cellWidth)
     .attr("y1", 0)
     .attr("x2", (d, i) => i * cellWidth)
     .attr("y2", gridHeight)
     .attr("stroke", "currentColor");

    // Colors mapping to status
    const getCellColor = (status: string) => {
      // Return tailwind slate / green / amber / rose color codes
      switch (status) {
        case 'validated':
          return '#10b981'; // emerald-500
        case 'mapped':
          return '#f59e0b'; // amber-500
        case 'high-activity':
          return '#f43f5e'; // rose-500
        case 'untouched':
        default:
          return '#e4e4e7'; // zinc-200 (light mode)
      }
    };

    // Color attributes matching current tailwind theme mode
    const isDark = document.documentElement.classList.contains('dark');
    const untouchedColor = isDark ? '#27272a' : '#e4e4e7'; // zinc-800 or zinc-200

    // Render cells
    const cells = g.selectAll(".cell")
       .data(gridData)
       .enter()
       .append("rect")
       .attr("class", "cell cursor-pointer group origin-center transition-all duration-300 hover:scale-95")
       .attr("x", d => d.col * cellWidth + 1.5)
       .attr("y", d => d.row * cellHeight + 1.5)
       .attr("width", cellWidth - 3)
       .attr("height", cellHeight - 3)
       .attr("rx", 4)
       .attr("fill", d => d.status === 'untouched' ? untouchedColor : getCellColor(d.status))
       .attr("opacity", d => {
         if (d.status === 'untouched') return 0.55;
         if (selectedTile && selectedTile.blockName === d.blockName) return 1;
         return 0.85;
       })
       .attr("stroke", d => {
         if (selectedTile && selectedTile.blockName === d.blockName) return '#06b6d4'; // stroke cyan
         return 'transparent';
       })
       .attr("stroke-width", d => (selectedTile && selectedTile.blockName === d.blockName) ? 2.5 : 0);

    // Interactive Hover & Click triggers
    cells.on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("opacity", 1);
      setHoveredTile(d);
    })
    .on("mouseout", function (event, d) {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("opacity", d.status === 'untouched' ? 0.55 : 0.85);
      setHoveredTile(null);
    })
    .on("click", function (event, d) {
      setSelectedTile(d);
    });

    // Add row labels A-H
    g.selectAll(".row-label")
     .data(rowLabels)
     .enter()
     .append("text")
     .attr("class", "row-label font-mono text-[10px] fill-zinc-400 font-semibold")
     .attr("x", -10)
     .attr("y", (d, i) => i * cellHeight + cellHeight / 2)
     .attr("dy", ".35em")
     .style("text-anchor", "end")
     .text(d => d);

    // Add col labels 1-12
    g.selectAll(".col-label")
     .data(colLabels)
     .enter()
     .append("text")
     .attr("class", "col-label font-mono text-[10px] fill-zinc-400 font-semibold")
     .attr("x", (d, i) => i * cellWidth + cellWidth / 2)
     .attr("y", gridHeight + 15)
     .style("text-anchor", "middle")
     .text(d => d);

    // Entry Transition
    cells.attr("transform-origin", (d) => `${d.col * cellWidth + cellWidth/2}px ${d.row * cellHeight + cellHeight/2}px`)
      .style("transform", "scale(0.3)")
      .transition()
      .duration(600)
      .delay((d, i) => (d.col + d.row) * 15)
      .style("transform", "scale(1)");

  }, [selectedProject, selectedProjectId, selectedTile, projects]);

  const statsCount = {
    validated: gridData.filter(t => t.status === 'validated').length,
    mapped: gridData.filter(t => t.status === 'mapped').length,
    highActivity: gridData.filter(t => t.status === 'high-activity').length,
    untouched: gridData.filter(t => t.status === 'untouched').length,
  };

  const handleSimulateE2EValidation = async (tile: HeatmapTile) => {
    if (!selectedProject || !tile) return;
    
    // Simulate encryption handshake
    const payload = btoa(JSON.stringify({
      projectId: selectedProject.id,
      blockSectorName: tile.blockName,
      validator: currentUser.name,
      timestamp: new Date().toISOString(),
      actionType: 'HOTSPOT_VALIDATION'
    }));

    await onValidateTile(selectedProject.id, tile.pendingEdits || 5, payload);
    
    // Optimistically update selected tile status
    const updatedTile: HeatmapTile = {
      ...tile,
      status: 'validated',
      pendingEdits: 0,
      activity: 10
    };
    
    setSelectedTile(updatedTile);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xs p-5 flex flex-col h-full" id="heatmap-bento-workspace" ref={containerRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-sans flex items-center gap-2">
            <Layers className="h-5 w-5 text-rose-500" />
            Validation Priority Heatmap (D3)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Interactively grid micro-tile sectors within active YouthMappers campaigns to flag immediate audit targets.</p>
        </div>

        {/* Selected Project selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500 font-semibold hidden md:inline">Inspect:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setSelectedTile(null);
            }}
            className="px-2.5 py-1.5 text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg text-zinc-800 dark:text-zinc-50 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectId}: {p.title.split(' - ')[1] || p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 flex-1">
        {/* Left D3 Visualization Panel */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="relative border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 bg-zinc-50/20 dark:bg-zinc-950/20 flex-1 flex items-center justify-center">
            
            <svg ref={svgRef} className="w-full h-auto max-h-[300px]"></svg>

            {/* Micro Hover Tooltip overlay coordinates */}
            {hoveredTile && (
              <div 
                className="absolute top-2.5 right-2.5 bg-zinc-900/95 text-white border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-[10px] font-mono shadow-md z-10 pointer-events-none"
              >
                <div className="font-bold text-teal-400">Sector: {hoveredTile.blockName}</div>
                <div>Status: {hoveredTile.status.replace('-', ' ')}</div>
                <div>Mappers: {hoveredTile.mappersCount}</div>
                {hoveredTile.pendingEdits > 0 && <div>Pending Edits: {hoveredTile.pendingEdits}</div>}
              </div>
            )}
          </div>

          {/* Color Indicators Legend */}
          <div className="flex items-center gap-4 mt-4 flex-wrap text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <span className="text-xs shrink-0 font-sans text-zinc-500">Legend:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-zinc-250 dark:bg-zinc-800" /> Untouched ({statsCount.untouched})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" /> Mapped ({statsCount.mapped})
            </span>
            <span className="flex items-center gap-1.5 animate-pulse">
              <span className="w-3 h-3 rounded bg-rose-500" /> Priority Hotspot ({statsCount.highActivity})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" /> Validated ({statsCount.validated})
            </span>
          </div>
        </div>

        {/* Right Inspection Details Panel (Selected Tile Inspector) */}
        <div className="lg:col-span-4 flex flex-col">
          {selectedTile ? (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/20 rounded-xl p-4 flex flex-col h-full justify-between animate-scale-up" id="tile-inspector-box">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800/80 pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-black text-zinc-400 tracking-widest block">Selected Sector</span>
                    <strong className="text-md font-extrabold text-zinc-800 dark:text-zinc-100 font-mono">Sector {selectedTile.blockName}</strong>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                    selectedTile.status === 'validated' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                    selectedTile.status === 'high-activity' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 animate-pulse' :
                    selectedTile.status === 'mapped' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {selectedTile.status}
                  </span>
                </div>

                {/* Simulated Sector Specs */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Active Contributors:</span>
                    <strong className="font-mono text-zinc-700 dark:text-zinc-300">{selectedTile.mappersCount} YM Volunteers</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-404">Pending OSM Changesets:</span>
                    <strong className="font-mono text-zinc-700 dark:text-zinc-350">{selectedTile.pendingEdits} changesets</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-404">Activity Level Index:</span>
                    <strong className="font-mono text-zinc-700 dark:text-zinc-350">{selectedTile.activity}% intensity</strong>
                  </div>
                </div>

                {/* Priority Status Alert */}
                {selectedTile.status === 'high-activity' && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg p-2.5 text-[11px] leading-relaxed flex gap-1.5 items-start">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                    <span>
                      <strong>High Conflict Hotspot:</strong> High mapper count submitting features rapidly on OSM mainnet. Requires E2E validation.
                    </span>
                  </div>
                )}

                {selectedTile.status === 'mapped' && (
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg p-2.5 text-[11px] leading-relaxed flex gap-1.5 items-start">
                    <Activity className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                    <span>
                      Standard validation pipeline. Peer-review can be verified using asymmetrical validation protocols.
                    </span>
                  </div>
                )}

                {selectedTile.status === 'validated' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg p-2.5 text-[11px] leading-relaxed flex gap-1.5 items-start">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                    <span>
                      This block is verified, encrypted, and locked globally. No pending conflicts are present.
                    </span>
                  </div>
                )}
              </div>

              {/* Inspector action button */}
              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800/85 mt-4">
                {(selectedTile.status === 'high-activity' || selectedTile.status === 'mapped') ? (
                  <button
                    onClick={() => handleSimulateE2EValidation(selectedTile)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                    E2E Verify Sector
                  </button>
                ) : (
                  <div className="text-center text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 py-1 px-2.5 rounded border border-emerald-555/10">
                    🔒 Grid Sector Signed & Verified
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center h-full text-zinc-400">
              <Layers className="h-8 w-8 text-zinc-300 dark:text-zinc-700 stroke-1.5 mb-2 animate-pulse-slow" />
              <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Sector Inspector</h4>
              <p className="text-xs text-zinc-400 max-w-[200px] mt-1 leading-normal">
                Click on any high-activity or mapped cell on the D3 grid to audit the raw YouthMappers changeset metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
