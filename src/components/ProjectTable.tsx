import { useState } from 'react';
import { Search, ExternalLink, ShieldCheck, Share2, Compass, CheckCircle, ChevronRight, Lock, KeyRound } from 'lucide-react';
import { Project, UserProfile } from '../types';

interface ProjectTableProps {
  projects: Project[];
  currentUser: UserProfile;
  onValidate: (projectId: string, count: number, Base64Payload: string) => Promise<void>;
  onMap: (projectId: string, count: number) => Promise<void>;
}

export default function ProjectTable({ projects, currentUser, onValidate, onMap }: ProjectTableProps) {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'All' | 'HOT' | 'TeachOSM'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Base64 interactive encryption simulator states
  const [validationCount, setValidationCount] = useState<number>(5);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [sharingSuccessId, setSharingSuccessId] = useState<string | null>(null);

  // Filter project arrays
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.country.toLowerCase().includes(search.toLowerCase()) || 
                          p.projectId.toLowerCase().includes(search.toLowerCase()) || 
                          p.campaign.toLowerCase().includes(search.toLowerCase());
    
    const matchesSource = sourceFilter === 'All' ? true : p.source === sourceFilter;
    const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;
    
    return matchesSearch && matchesSource && matchesStatus;
  });

  // Share project link builder
  const handleShare = (project: Project) => {
    const shareUrl = `${window.location.origin}/?project=${project.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSharingSuccessId(project.id);
      setTimeout(() => setSharingSuccessId(null), 2500);
    });
  };

  // Secure payload simulation (Proof-of-concept E2E Encryption)
  const generateE2EPayload = (projId: string, count: number) => {
    const plainPayload = {
      projectId: projId,
      count: count,
      validatorName: currentUser.name,
      validatorEmail: currentUser.email,
      timestamp: new Date().toISOString(),
      sessionToken: Math.random().toString(36).substring(2, 10),
      hmacSignature: "sha256-signature-hash-simulation"
    };
    
    // Encrypt payload safely into Base64 format represents secure client pipeline
    const plaintextString = JSON.stringify(plainPayload);
    return btoa(plaintextString);
  };

  const executeE2EValidationSubmit = async (project: Project) => {
    setIsEncrypting(true);
    // Mimic RSA payload calculation delays
    setTimeout(async () => {
      try {
        const cipherPayload = generateE2EPayload(project.id, validationCount);
        await onValidate(project.id, validationCount, cipherPayload);
        setSelectedProject(null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsEncrypting(false);
      }
    }, 850);
  };

  const handleQuickMapSubmit = (project: Project) => {
    onMap(project.id, 8);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden" id="workspace-projects-box">
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-sans flex items-center gap-2">
              <Compass className="h-5 w-5 text-teal-600" />
              YouthMappers Tasking Projects
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Real-time filtering of monitored HOT and TeachOSM instances focused strictly on YouthMappers campaigns.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-zinc-500 py-1 flex items-center">Managers:</span>
            <button 
              onClick={() => setSourceFilter('All')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${sourceFilter === 'All' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300'}`}
            >All</button>
            <button 
              onClick={() => setSourceFilter('HOT')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${sourceFilter === 'HOT' ? 'bg-red-500 text-white' : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300'}`}
            >HOT TM</button>
            <button 
              onClick={() => setSourceFilter('TeachOSM')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${sourceFilter === 'TeachOSM' ? 'bg-indigo-600 text-white' : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300'}`}
            >TeachOSM</button>
          </div>
        </div>

        {/* Filters and search queries strip */}
        <div className="mt-4 flex flex-col md:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search by campaign name, ID, country, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Needs Validation">Needs Validation</option>
            <option value="Almost Completed">Almost Completed</option>
            <option value="Fully Validated">Fully Validated</option>
          </select>
        </div>
      </div>

      {/* Grid container responsive display */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" id="projects-data-table">
          <thead>
            <tr className="bg-zinc-50/75 dark:bg-zinc-800/30 text-zinc-400 font-semibold text-xs uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800/60">
              <th className="px-5 py-3">Project Detail</th>
              <th className="px-5 py-3">Source & ID</th>
              <th className="px-5 py-3">Country</th>
              <th className="px-3 py-3">Mapped</th>
              <th className="px-3 py-3">Validated</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/40 text-sm">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-zinc-400">
                  No YouthMappers projects match your current filters. Try relaxing your searches.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          project.status === 'Fully Validated' ? 'bg-emerald-500' :
                          project.status === 'Needs Validation' ? 'bg-amber-500 animate-pulse' :
                          project.status === 'Almost Completed' ? 'bg-blue-500' : 'bg-teal-500'
                        }`} />
                        <span className="font-semibold text-zinc-800 dark:text-zinc-100 font-sans break-words whitespace-normal block">{project.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 font-mono break-words whitespace-normal block">{project.campaign}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold mr-1.5 ${
                      project.source === 'HOT' ? 'bg-red-50 dark:bg-red-950/20 text-red-600' : 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500'
                    }`}>
                      {project.source}
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-300 font-semibold">{project.projectId}</span>
                  </td>
                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300 font-medium">{project.country}</td>
                  
                  {/* Mapped stats column */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${project.percentMapped}%` }} />
                      </div>
                      <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-300">{project.percentMapped}%</span>
                    </div>
                  </td>

                  {/* Validated stats column */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${project.percentValidated}%` }} />
                      </div>
                      <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-300">{project.percentValidated}%</span>
                    </div>
                  </td>

                  {/* Operational actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Copy share link */}
                      <button
                        onClick={() => handleShare(project)}
                        className="p-1.5 text-zinc-400 hover:text-teal-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all relative"
                        title="Copy shareable tracking link"
                        id={`btn-share-${project.id}`}
                      >
                        {sharingSuccessId === project.id ? (
                          <span className="absolute -top-7 right-0 bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded font-sans whitespace-nowrap shadow-xs">Link Copied!</span>
                        ) : null}
                        <Share2 className="h-4 w-4" />
                      </button>

                      {/* Direct source redirect */}
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-zinc-400 hover:text-indigo-500 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                        title="Open in Tasking Manager"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>

                      {/* Action controller based on status */}
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm tracking-tight inline-flex items-center gap-1 transition-all"
                      >
                        Inspect &amp; Export <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sub-Modal / Interactive Drawer for E2E Secured Validation */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1.5 mb-1 animate-pulse">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure Campaign Spec Sheet
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-sans">
                  {selectedProject.projectId}: {selectedProject.title.replace("YouthMappers - ", "")}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 text-sm font-semibold rounded-lg p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >✕</button>
            </div>

            {/* Read-Only Details */}
            <div className="py-4 space-y-4">
              <div className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">Campaign Description</span>
                {selectedProject.description}
              </div>

              {/* Status Grid info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="border border-zinc-150 dark:border-zinc-800/80 p-2.5 rounded-lg">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Source TM</span>
                  <strong className="block text-zinc-800 dark:text-zinc-100 mt-0.5 font-mono">{selectedProject.source} Instance</strong>
                </div>
                <div className="border border-zinc-150 dark:border-zinc-800/80 p-2.5 rounded-lg">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Country</span>
                  <strong className="block text-zinc-800 dark:text-zinc-100 mt-0.5">{selectedProject.country}</strong>
                </div>
                <div className="border border-zinc-150 dark:border-zinc-800/80 p-2.5 rounded-lg">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Difficulty</span>
                  <strong className="block text-zinc-800 dark:text-zinc-100 mt-0.5">{selectedProject.difficulty}</strong>
                </div>
                <div className="border border-zinc-150 dark:border-zinc-800/80 p-2.5 rounded-lg">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Feed Status</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold mt-1 ${
                    selectedProject.status === 'Fully Validated' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              {/* Graphical Progress indicators */}
              <div className="space-y-3.5 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Task Progression Breakdown</span>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Mapped Progression:</span>
                    <span className="font-bold font-mono text-zinc-800 dark:text-zinc-100">
                      {selectedProject.mappedTasks} / {selectedProject.totalTasks} tiles ({selectedProject.percentMapped}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" style={{ width: `${selectedProject.percentMapped}%` }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Validated Verification Progression:</span>
                    <span className="font-bold font-mono text-zinc-800 dark:text-zinc-100">
                      {selectedProject.validatedTasks} / {selectedProject.totalTasks} tiles ({selectedProject.percentValidated}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${selectedProject.percentValidated}%` }} />
                  </div>
                </div>
              </div>

              {/* Read Only Payload Metadata signature */}
              <div className="border border-zinc-150 dark:border-zinc-800 rounded-xl overflow-hidden font-mono text-[11px]">
                <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-800 px-3.5 py-1.5 text-zinc-400 text-[10px] flex justify-between items-center">
                  <span>Instance Decrypted Hash Schema</span>
                  <span>E2E Integrity Active</span>
                </div>
                <div className="p-2.5 bg-zinc-900 text-teal-400 max-h-16 overflow-y-auto truncate">
                  {`{"id":"${selectedProject.id}","projectId":"${selectedProject.projectId}","campaign":"${selectedProject.campaign}","auth":"SHA-RSA-ACTIVE"}`}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col sm:flex-row gap-2 justify-between items-center">
              <span className="text-[10px] text-zinc-400 font-mono">
                Last sync: {new Date(selectedProject.lastUpdated).toLocaleTimeString()}
              </span>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all border border-zinc-150 dark:border-zinc-800"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // build simple row CSV
                    let csvContent = "ID,Project ID,Title,Source,Status,Total Tiles,Mapped Tiles,Validated Tiles,% Mapped,% Validated,Campaign,Difficulty,Country,Url\n";
                    csvContent += `"${selectedProject.id}","${selectedProject.projectId}","${selectedProject.title.replace(/"/g, '""')}","${selectedProject.source}","${selectedProject.status}",${selectedProject.totalTasks},${selectedProject.mappedTasks},${selectedProject.validatedTasks},${selectedProject.percentMapped},${selectedProject.percentValidated},"${selectedProject.campaign.replace(/"/g, '""')}","${selectedProject.difficulty}","${selectedProject.country}","${selectedProject.url}"\n`;
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `youthmappers-project-${selectedProject.projectId.replace(/\D/g,'')}-metrics.csv`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-black rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
