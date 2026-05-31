import { createContext, useCallback, useReducer } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export const TaskContext = createContext(null);

// ── Action Types ─────────────────────────────────────────────
const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TASKS: 'SET_TASKS',
  SET_ERROR: 'SET_ERROR',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  MOVE_TASK: 'MOVE_TASK',
};

// ── Reducer ──────────────────────────────────────────────────
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case TASK_ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload, loading: false, error: null };
    case TASK_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case TASK_ACTIONS.ADD_TASK:
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      };
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };
    case TASK_ACTIONS.MOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload.id ? { ...t, stage: action.payload.stage } : t
        ),
      };
    default:
      return state;
  }
};

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// ── Provider ─────────────────────────────────────────────────
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // ── Fetch Tasks ──────────────────────────────────────────
  const fetchTasks = useCallback(async (filters = {}) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const params = new URLSearchParams();
      if (filters.stage) params.append('stage', filters.stage);
      if (filters.search) params.append('search', filters.search);

      const { data } = await api.get(`/tasks?${params.toString()}`);
      dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: data.data });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
    }
  }, []);

  // ── Create Task ──────────────────────────────────────────
  const createTask = useCallback(async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: data.data });
      toast.success('Task created! ✅');
      return { success: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // ── Update Task ──────────────────────────────────────────
  const updateTask = useCallback(async (id, taskData) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: data.data });
      toast.success('Task updated! ✏️');
      return { success: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // ── Delete Task ──────────────────────────────────────────
  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
      toast.success('Task deleted');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // ── Move Task (drag & drop / stage update) ───────────────
  const moveTask = useCallback(async (id, newStage) => {
    // Optimistic update
    dispatch({ type: TASK_ACTIONS.MOVE_TASK, payload: { id, stage: newStage } });

    try {
      const { data } = await api.patch(`/tasks/${id}/stage`, { stage: newStage });
      // Sync with server response to keep data consistent
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: data.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to move task';
      toast.error(message);
      // Revert optimistic update by refetching
      fetchTasks();
      return { success: false, message };
    }
  }, [fetchTasks]);

  const value = {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
