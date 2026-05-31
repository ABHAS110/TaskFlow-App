import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Edit2, Trash2, GripVertical, Clock } from 'lucide-react';
import { getStageColor, truncate, formatRelativeDate, shortId } from '../utils/helpers';

/**
 * Individual task card with drag handle, edit, and delete actions.
 * @param {object} task - The task object
 * @param {number} index - Draggable index
 * @param {Function} onEdit - Opens edit modal
 * @param {Function} onDelete - Opens delete confirmation
 */
const TaskCard = ({ task, index, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const stageColors = getStageColor(task.stage);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`task-card group animate-fade-in ${snapshot.isDragging ? 'is-dragging rotate-1 shadow-card-hover' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
          }}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            {/* Drag handle */}
            <div
              {...provided.dragHandleProps}
              className="flex-shrink-0 mt-0.5 text-text-subtle hover:text-text-muted cursor-grab active:cursor-grabbing transition-colors"
              aria-label="Drag handle"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Stage badge */}
            <div className="flex-1">
              <span className={stageColors.badge}>
                <span className={`w-1.5 h-1.5 rounded-full ${stageColors.dot}`} />
                {task.stage}
              </span>
            </div>

            {/* Action buttons - visible on hover */}
            <div
              className={`flex items-center gap-1 transition-all duration-150 ${
                isHovered || snapshot.isDragging ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}
            >
              <button
                id={`task-edit-${task._id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-1.5 rounded-lg text-text-subtle hover:text-accent hover:bg-accent/10 transition-all duration-150"
                title="Edit task"
                aria-label={`Edit task: ${task.title}`}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                id={`task-delete-${task._id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                }}
                className="p-1.5 rounded-lg text-text-subtle hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                title="Delete task"
                aria-label={`Delete task: ${task.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Task Title */}
          <h3
            className={`text-sm font-semibold text-text-primary leading-snug mb-1.5 ${
              task.stage === 'Done' ? 'line-through text-text-muted' : ''
            }`}
          >
            {task.title}
          </h3>

          {/* Task Description */}
          {task.description && (
            <p className="text-xs text-text-muted leading-relaxed mb-3">
              {truncate(task.description, 120)}
            </p>
          )}

          {/* Card Footer */}
          <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-dark-border">
            <span className="font-mono text-xs text-text-subtle">
              {shortId(task._id)}
            </span>
            <div className="flex items-center gap-1 text-xs text-text-subtle">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeDate(task.createdAt)}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
