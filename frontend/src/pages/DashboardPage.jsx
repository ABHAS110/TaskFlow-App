import { useEffect, useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus, Menu } from 'lucide-react';
import useTasks from '../hooks/useTasks';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatsBar from '../components/StatsBar';
import LoadingSpinner from '../components/LoadingSpinner';

const STAGES = ['Todo', 'In Progress', 'Done'];

/**
 * Main dashboard page with Kanban board, drag-and-drop, and task CRUD.
 */
const DashboardPage = () => {
  const { activeStage, searchQuery, setIsMobileMenuOpen } = useOutletContext();
  const { tasks, loading, fetchTasks, moveTask, deleteTask } = useTasks();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultModalStage, setDefaultModalStage] = useState('Todo');

  // Delete confirmation state
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Client-side filtered tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (activeStage) {
      result = result.filter((t) => t.stage === activeStage);
    }

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    return result;
  }, [tasks, activeStage, searchQuery]);

  // Group tasks by stage for columns
  const tasksByStage = useMemo(() => {
    return STAGES.reduce((acc, stage) => {
      acc[stage] = filteredTasks.filter((t) => t.stage === stage);
      return acc;
    }, {});
  }, [filteredTasks]);

  // ── Handlers ────────────────────────────────────────────────
  const handleOpenCreate = useCallback((stage = 'Todo') => {
    setEditingTask(null);
    setDefaultModalStage(stage);
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task) => {
    setEditingTask(task);
    setDefaultModalStage(task.stage);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleOpenDelete = useCallback((task) => {
    setDeletingTask(task);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    await deleteTask(deletingTask._id);
    setIsDeleting(false);
    setDeletingTask(null);
  }, [deletingTask, deleteTask]);

  // ── Drag & Drop ──────────────────────────────────────────────
  const handleDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result;

      // Drop outside or same position
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      // Stage changed
      if (destination.droppableId !== source.droppableId) {
        const newStage = destination.droppableId;
        await moveTask(draggableId, newStage);
      }
    },
    [moveTask]
  );

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" text="Loading your tasks..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            id="dashboard-mobile-menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden btn-ghost p-2 rounded-xl"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {activeStage ? `${activeStage} Tasks` : 'My Board'}
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              {searchQuery
                ? `Showing results for "${searchQuery}"`
                : `${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <button
          id="dashboard-create-task"
          onClick={() => handleOpenCreate()}
          className="btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>

      {/* Stats bar */}
      <StatsBar />

      {/* Kanban board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6">
          {STAGES.map((stage) => {
            // If filtering by stage, only show that column
            if (activeStage && activeStage !== stage) return null;
            return (
              <KanbanColumn
                key={stage}
                stage={stage}
                tasks={tasksByStage[stage] || []}
                onAddTask={handleOpenCreate}
                onEditTask={handleOpenEdit}
                onDeleteTask={handleOpenDelete}
              />
            );
          })}
        </div>
      </DragDropContext>

      {/* Create / Edit modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        defaultStage={defaultModalStage}
        onClose={handleCloseModal}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardPage;
