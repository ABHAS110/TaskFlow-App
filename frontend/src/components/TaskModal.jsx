import { useState, useEffect } from 'react';
import { X, Loader2, AlignLeft, Tag } from 'lucide-react';
import useTasks from '../hooks/useTasks';

const STAGES = ['Todo', 'In Progress', 'Done'];

/**
 * Modal for creating or editing a task.
 * @param {boolean} isOpen
 * @param {object|null} task - Null for create, task object for edit
 * @param {string} defaultStage - Pre-selected stage for create
 * @param {Function} onClose
 */
const TaskModal = ({ isOpen, task, defaultStage = 'Todo', onClose }) => {
  const { createTask, updateTask } = useTasks();
  const isEditing = Boolean(task);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: defaultStage,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          stage: task.stage || 'Todo',
        });
      } else {
        setFormData({ title: '', description: '', stage: defaultStage });
      }
      setErrors({});
    }
  }, [isOpen, task, defaultStage]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    if (formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      stage: formData.stage,
    };

    const result = isEditing
      ? await updateTask(task._id, payload)
      : await createTask(payload);

    setIsSubmitting(false);
    if (result.success) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="overlay animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative w-full max-w-lg animate-slide-up rounded-2xl border border-dark-border overflow-hidden"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-modal)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <div>
            <h2 id="task-modal-title" className="text-lg font-semibold text-text-primary">
              {isEditing ? 'Edit Task' : 'Create Task'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {isEditing ? 'Update the task details below' : 'Fill in the details to create a new task'}
            </p>
          </div>
          <button
            id="task-modal-close"
            onClick={onClose}
            className="btn-ghost p-2 rounded-xl"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="label">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Title <span className="text-red-400">*</span>
              </span>
            </label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={`input ${errors.title ? 'input-error' : ''}`}
              autoFocus
              disabled={isSubmitting}
              maxLength={200}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-text-subtle text-right">
              {formData.title.length}/200
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-description" className="label">
              <span className="flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5" />
                Description
              </span>
            </label>
            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details (optional)..."
              rows={4}
              className={`input resize-none ${errors.description ? 'input-error' : ''}`}
              disabled={isSubmitting}
              maxLength={2000}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-400">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-text-subtle text-right">
              {formData.description.length}/2000
            </p>
          </div>

          {/* Stage selector */}
          <div>
            <label className="label">Stage</label>
            <div className="grid grid-cols-3 gap-2">
              {STAGES.map((stage) => {
                const stageStyles = {
                  Todo: {
                    active: 'bg-blue-500/15 border-blue-500/50 text-blue-400',
                    inactive: 'border-dark-border text-text-muted hover:border-blue-500/30',
                    dot: 'bg-blue-400',
                  },
                  'In Progress': {
                    active: 'bg-amber-500/15 border-amber-500/50 text-amber-400',
                    inactive: 'border-dark-border text-text-muted hover:border-amber-500/30',
                    dot: 'bg-amber-400',
                  },
                  Done: {
                    active: 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400',
                    inactive: 'border-dark-border text-text-muted hover:border-emerald-500/30',
                    dot: 'bg-emerald-400',
                  },
                };
                const style = stageStyles[stage];
                const isSelected = formData.stage === stage;

                return (
                  <button
                    key={stage}
                    type="button"
                    id={`task-stage-${stage.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setFormData((prev) => ({ ...prev, stage }))}
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                      isSelected ? style.active : style.inactive
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="task-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="task-modal-submit"
              disabled={isSubmitting}
              className="btn-primary min-w-[120px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditing ? 'Saving...' : 'Creating...'}
                </span>
              ) : (
                isEditing ? 'Save Changes' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
