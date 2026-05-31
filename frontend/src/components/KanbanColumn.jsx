import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import { getStageColor } from '../utils/helpers';

/**
 * A Kanban column that wraps a Droppable zone.
 * @param {string} stage - Column stage identifier
 * @param {Array} tasks - Tasks belonging to this column
 * @param {Function} onAddTask - Open create modal preset to this stage
 * @param {Function} onEditTask - Open edit modal
 * @param {Function} onDeleteTask - Open delete confirmation
 */
const KanbanColumn = ({ stage, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const stageColors = getStageColor(stage);

  return (
    <div className="kanban-column">
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-dark-border">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${stageColors.dot}`} />
          <h2 className={`text-sm font-semibold ${stageColors.column}`}>
            {stage}
          </h2>
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${stageColors.bg} ${stageColors.column}`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          id={`column-add-${stage.toLowerCase().replace(' ', '-')}`}
          onClick={() => onAddTask(stage)}
          className="p-1.5 rounded-lg text-text-subtle hover:text-accent hover:bg-accent/10 transition-all duration-150"
          title={`Add task to ${stage}`}
          aria-label={`Add task to ${stage}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable zone */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[200px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-accent/5' : ''
            }`}
            style={{
              maxHeight: 'calc(100vh - 280px)',
            }}
          >
            {tasks.length === 0 ? (
              <EmptyState stage={stage} onAdd={() => onAddTask(stage)} />
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
