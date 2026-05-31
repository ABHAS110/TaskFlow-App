import { ClipboardList, Plus } from 'lucide-react';

/**
 * Empty state component for Kanban columns with no tasks.
 * @param {string} stage - The column's stage name
 * @param {Function} onAdd - Callback to open the create task modal
 */
const EmptyState = ({ stage, onAdd }) => {
  const stageMessages = {
    Todo: {
      emoji: '📋',
      message: 'No tasks here yet',
      sub: 'Add your first task to get started',
    },
    'In Progress': {
      emoji: '⚡',
      message: 'Nothing in progress',
      sub: 'Move a task here or start a new one',
    },
    Done: {
      emoji: '🎉',
      message: 'No completed tasks yet',
      sub: 'Complete a task to see it here',
    },
  };

  const content = stageMessages[stage] || stageMessages.Todo;

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="text-4xl mb-3 select-none">{content.emoji}</div>
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-dark-hover border border-dark-border mb-4">
        <ClipboardList className="w-5 h-5 text-text-subtle" />
      </div>
      <p className="text-sm font-medium text-text-muted mb-1">{content.message}</p>
      <p className="text-xs text-text-subtle mb-4">{content.sub}</p>
      {onAdd && (
        <button
          id={`empty-state-add-${stage.toLowerCase().replace(' ', '-')}`}
          onClick={onAdd}
          className="btn-secondary text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      )}
    </div>
  );
};

export default EmptyState;
