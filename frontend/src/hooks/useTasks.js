import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

/**
 * Custom hook to access the TaskContext.
 * Throws if used outside of TaskProvider.
 */
const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default useTasks;
