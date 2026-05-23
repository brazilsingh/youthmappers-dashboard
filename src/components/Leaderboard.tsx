import { Trophy, Award, Medal, Users2, Sparkles, Flame } from 'lucide-react';
import { ContributorRanking } from '../types';

interface LeaderboardProps {
  contributors: ContributorRanking[];
}

export default function Leaderboard({ contributors }: LeaderboardProps) {
  // Compute aggregate impact scores
  const totalImpactScores = contributors.reduce((sum, c) => sum + c.score, 0);
  const totalContributorCount = contributors.length;
  
  // Custom estimated stats representing global YouthMappers mapathon output
  const estimatedAreaKm2 = Math.round(totalImpactScores * 1.84);
  const totalHoursContributed = Math.round(totalImpactScores * 0.45);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden h-full flex flex-col" id="community-leaderboard-card">
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-sans flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500 fill-amber-100 dark:fill-amber-950/20" />
            Top Validation & Mapping Leaders
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Real-time individual contributor rankings mapping regional YouthMappers impact.</p>
        </div>
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-lg">
          <Flame className="h-5 w-5 fill-current animate-pulse" />
        </div>
      </div>

      {/* Global Community metrics segment */}
      <div className="p-4 bg-zinc-50/75 dark:bg-zinc-850/20 border-b border-zinc-100 dark:border-zinc-800/60 grid grid-cols-3 gap-2 text-center">
        <div className="p-2">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Total Impact</span>
          <span className="text-base font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5 block">
            {totalImpactScores.toLocaleString()} pts
          </span>
        </div>
        <div className="p-2 border-x border-zinc-100 dark:border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Digitized Area</span>
          <span className="text-base font-bold font-mono text-zinc-800 dark:text-zinc-100 mt-0.5 block">
            ~{estimatedAreaKm2.toLocaleString()} km²
          </span>
        </div>
        <div className="p-2">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Mappers Work</span>
          <span className="text-base font-bold font-mono text-indigo-500 mt-0.5 block">
            ~{totalHoursContributed.toLocaleString()} hrs
          </span>
        </div>
      </div>

      {/* Detailed listing */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40 overflow-y-auto flex-1 max-h-[460px]">
        {contributors.map((member, index) => {
          // Dynamic medal styles for top 3
          const isTopThree = member.rank <= 3;
          const rankColors = 
            member.rank === 1 ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30' :
            member.rank === 2 ? 'bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-850/30' :
            member.rank === 3 ? 'bg-amber-100/50 text-amber-700 border-amber-300 dark:bg-amber-950/15' :
            'bg-zinc-50 text-zinc-400 border-zinc-200 dark:bg-zinc-800';

          return (
            <div 
              key={member.name}
              className={`p-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-850/5 transition-all duration-200 ${member.rank === 1 ? 'bg-teal-50/10' : ''}`}
            >
              <div className="flex items-center gap-3">
                {/* Visual rank indicators */}
                <div className={`w-7 h-7 flex items-center justify-center rounded-full border font-mono font-bold text-sm shadow-2xs ${rankColors}`}>
                  {member.rank === 1 ? <Trophy className="h-4 w-4 fill-current text-amber-500" /> : member.rank}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-800 dark:text-zinc-100 font-sans text-sm">{member.name}</span>
                    {member.rank === 1 && (
                      <span className="p-0.5 text-[9px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/40 rounded flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5 inline-block" /> Top Lead
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5 flex items-center gap-1">
                    <Users2 className="h-3 w-3 text-zinc-300" />
                    {member.chapter}
                  </p>
                  
                  {/* Performance Badges */}
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {member.badges.map((badge) => (
                      <span 
                        key={badge}
                        className="px-1.5 py-0.5 text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded font-mono"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Counts score summary */}
              <div className="text-right flex flex-col items-end">
                <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-100">
                  {member.score.toLocaleString()} <span className="text-[10px] text-zinc-400 font-normal">pts</span>
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">
                  M: <strong className="text-amber-500">{member.mappedCount}</strong> | V: <strong className="text-emerald-500">{member.validatedCount}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
