import React from 'react';
import { Microscope, Shield, Trees, Radio, ArrowRight, Plus, Eye, Users } from 'lucide-react';
import { Task, TaskPillar } from '../types';

interface PillarsOverviewProps {
  tasks: Task[];
  onSelectPillarTasks: (pillar: TaskPillar) => void;
  onNewTaskWithPillar: (pillar: TaskPillar) => void;
}

export const PillarsOverview: React.FC<PillarsOverviewProps> = ({
  tasks,
  onSelectPillarTasks,
  onNewTaskWithPillar,
}) => {
  const pillarsConfig = [
    {
      id: 'research' as TaskPillar,
      title: 'Field Biology & Ecology',
      tagline: 'Empirical research on the sensory adaptations, hunting efficiency, and thermal dynamics of African owls.',
      icon: Microscope,
      color: 'from-[#1D241B] to-[#101510] border-[#C6A56A]/50 text-[#C6A56A]',
      btnColor: 'bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510]',
    },
    {
      id: 'acoustics' as TaskPillar,
      title: 'Bioacoustics & Soundscapes',
      tagline: 'Autonomous acoustic logger arrays mapping territorial duets, vocal frequencies, and density across riverine corridors.',
      icon: Radio,
      color: 'from-amber-950/40 to-[#101510] border-amber-700/50 text-amber-300',
      btnColor: 'bg-amber-900/80 hover:bg-amber-800 text-[#F2EFE5]',
    },
    {
      id: 'habitat' as TaskPillar,
      title: 'Habitat & Cavity Monitoring',
      tagline: 'Protecting mature acacia trees, baobab cavities, and granite kopje roosts essential for successful breeding.',
      icon: Trees,
      color: 'from-emerald-950/40 to-[#101510] border-emerald-700/50 text-emerald-300',
      btnColor: 'bg-emerald-900/80 hover:bg-emerald-800 text-[#F2EFE5]',
    },
    {
      id: 'sightings' as TaskPillar,
      title: 'Nocturnal Observations & Traps',
      tagline: 'Motion-sensor camera trap grids verifying elusive species, predation events, and crepuscular hunting behavior.',
      icon: Eye,
      color: 'from-indigo-950/40 to-[#101510] border-indigo-700/50 text-indigo-300',
      btnColor: 'bg-indigo-900/80 hover:bg-indigo-800 text-[#F2EFE5]',
    },
    {
      id: 'community' as TaskPillar,
      title: 'Ranger & Community Outreach',
      tagline: 'Training safari guides, rangers, and bordering agrarian communities on ethical red-light protocols and biological rodent control.',
      icon: Users,
      color: 'from-rose-950/40 to-[#101510] border-rose-700/50 text-rose-300',
      btnColor: 'bg-rose-900/80 hover:bg-rose-800 text-[#F2EFE5]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-[#141A13] border border-[#34392F] rounded-lg p-6 sm:p-8 space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] font-mono text-[#C6A56A]">
          BRACA · Serengeti Raptor Conservation Framework
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#F2EFE5] font-normal tracking-wide">
          Research Workstreams & Ecological Pillars
        </h2>
        <p className="text-xs sm:text-sm text-[#A6AA9A] font-light max-w-2xl leading-relaxed">
          Targeting vulnerable nocturnal raptor populations across the Serengeti through BRACA bioacoustics arrays, thermal imaging, dietary pellet analysis, and community ranger education.
        </p>
      </div>

      {/* Grid of Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillarsConfig.map((p) => {
          const Icon = p.icon;
          const pillarTasks = tasks.filter((t) => t.pillar === p.id);
          const activeTasks = pillarTasks.filter((t) => t.status !== 'done');
          const completedTasks = pillarTasks.filter((t) => t.status === 'done');

          return (
            <div
              key={p.id}
              className={`bg-gradient-to-b ${p.color} border rounded-lg p-6 flex flex-col justify-between space-y-6 shadow-sm`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-[#101510]/80 rounded border border-[#34392F]/60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#A6AA9A]">
                    {pillarTasks.length} task{pillarTasks.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif font-medium text-[#F2EFE5]">{p.title}</h3>
                  <p className="text-xs text-[#A6AA9A] font-light leading-relaxed">{p.tagline}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-mono text-[#A6AA9A]">
                    <span>Active: {activeTasks.length}</span>
                    <span>Completed: {completedTasks.length}</span>
                  </div>
                  <div className="h-1.5 bg-[#101510] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C6A56A] transition-all duration-300"
                      style={{
                        width: `${
                          pillarTasks.length > 0
                            ? (completedTasks.length / pillarTasks.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2 border-t border-[#34392F]/60">
                <button
                  onClick={() => onSelectPillarTasks(p.id)}
                  className={`flex-1 py-2 px-3 ${p.btnColor} text-xs font-mono uppercase tracking-wider font-semibold rounded flex items-center justify-center space-x-1 transition-colors`}
                >
                  <span>Filter Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNewTaskWithPillar(p.id)}
                  title={`Add task for ${p.title}`}
                  className="p-2 bg-[#101510] hover:bg-[#1D241B] text-[#A6AA9A] hover:text-[#C6A56A] border border-[#34392F] rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
