import { Activity, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { Project } from '../types';

interface MetricCardsProps {
  projects: Project[];
}

export default function MetricCards({ projects }: MetricCardsProps) {
  // Calculations
  const activeCount = projects.filter(p => p.status === 'Active' || p.status === 'Needs Validation' || p.status === 'Almost Completed').length;
  const completedCount = projects.filter(p => p.status === 'Fully Validated').length;
  
  const totalTiles = projects.reduce((sum, p) => sum + p.totalTasks, 0);
  const totalMapped = projects.reduce((sum, p) => sum + p.mappedTasks, 0);
  const totalValidated = projects.reduce((sum, p) => sum + p.validatedTasks, 0);
  
  const totalLeftToMap = Math.max(0, totalTiles - totalMapped);
  const totalLeftToValidate = Math.max(0, totalMapped - totalValidated);

  // Percentages
  const mappedPercentage = totalTiles > 0 ? Math.round((totalMapped / totalTiles) * 100) : 0;
  const validatedPercentage = totalTiles > 0 ? Math.round((totalValidated / totalTiles) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="metric-cards-container">
      {/* Active Projects Card */}
      <div 
        id="card-active-projects"
        className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Active Projects</p>
            <h3 className="text-3xl font-bold font-sans mt-2 text-zinc-900 dark:text-zinc-50">{activeCount} <span className="text-xs text-zinc-400 font-normal">monitored</span></h3>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-lg">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-zinc-500 gap-1.5 border-t border-zinc-100 dark:border-zinc-800/40 pt-3">
          <span className="font-semibold text-teal-600 dark:text-teal-400">{completedCount}</span>
          <span>project(s) completed & validated</span>
        </div>
      </div>

      {/* Mapped Progress Card */}
      <div 
        id="card-mapped"
        className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Aggregate Mapped</p>
            <h3 className="text-3xl font-bold font-sans mt-2 text-zinc-900 dark:text-zinc-50">
              {mappedPercentage}%
              <span className="text-xs text-zinc-400 font-normal ml-2">({totalMapped.toLocaleString()} tiles)</span>
            </h3>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800/40 pt-3">
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 mb-1">
            <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${mappedPercentage}%` }} />
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Remaining: {totalLeftToMap.toLocaleString()} tiles</span>
            <span>Total: {totalTiles.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Validated Progress Card */}
      <div 
        id="card-validated"
        className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Aggregate Validated</p>
            <h3 className="text-3xl font-bold font-sans mt-2 text-zinc-900 dark:text-zinc-50">
              {validatedPercentage}%
              <span className="text-xs text-zinc-400 font-normal ml-2">({totalValidated.toLocaleString()} tiles)</span>
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800/40 pt-3">
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 mb-1">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${validatedPercentage}%` }} />
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Left to Validate: {totalLeftToValidate.toLocaleString()} tiles</span>
            <span>Ratio: {totalValidated > 0 && totalMapped > 0 ? Math.round((totalValidated / totalMapped) * 100) : 0}% of map</span>
          </div>
        </div>
      </div>

      {/* General Completion Card */}
      <div 
        id="card-general-completion"
        className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Validation Deficit</p>
            <h3 className="text-3xl font-bold font-sans mt-2 text-zinc-900 dark:text-zinc-50">
              {(totalMapped - totalValidated).toLocaleString()}
              <span className="text-xs text-zinc-400 font-normal ml-2">tiles</span>
            </h3>
          </div>
          <div className={`p-3 rounded-lg ${totalLeftToValidate > 100 ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-zinc-500 gap-1.5 border-t border-zinc-100 dark:border-zinc-800/40 pt-3">
          <span>Validation lag:</span>
          <span className={`font-semibold ${totalLeftToValidate > 150 ? 'text-rose-600' : 'text-blue-600'}`}>
            {totalMapped > 0 ? (Math.round(((totalMapped - totalValidated) / totalMapped) * 100)) : 0}% of mapped
          </span>
          <span>backlog</span>
        </div>
      </div>
    </div>
  );
}
