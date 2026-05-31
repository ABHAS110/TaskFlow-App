import useTasks from '../hooks/useTasks';

const STAGES = ['Todo', 'In Progress', 'Done'];

const stageConfig = {
  Todo: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Todo' },
  'In Progress': { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'In Progress' },
  Done: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Done' },
};

/**
 * Stats bar showing task counts across all stages.
 */
const StatsBar = () => {
  const { tasks } = useTasks();

  const counts = STAGES.reduce((acc, stage) => {
    acc[stage] = tasks.filter((t) => t.stage === stage).length;
    return acc;
  }, {});

  const stats = [
    {
      label: 'Total',
      value: tasks.length,
      color: 'text-accent',
      bg: 'bg-accent/10',
      dot: 'bg-accent',
    },
    {
      label: 'Todo',
      value: counts['Todo'],
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      dot: 'bg-blue-400',
    },
    {
      label: 'In Progress',
      value: counts['In Progress'],
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      dot: 'bg-amber-400',
    },
    {
      label: 'Done',
      value: counts['Done'],
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      dot: 'bg-emerald-400',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-dark-border ${stat.bg} transition-all duration-200 hover:scale-105`}
        >
          <div className={`w-2 h-2 rounded-full ${stat.dot}`} />
          <span className="text-xs font-medium text-text-muted">{stat.label}</span>
          <span className={`text-base font-bold ${stat.color} font-mono`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
