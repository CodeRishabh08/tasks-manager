
import { useState, useCallback } from 'react';

import {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} from '../services/taskService';

export function useTasks() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // READ
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getTasks();

      if (error) throw error;

      setTasks(data ?? []);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }, []);


  // CREATE
  const addTask = async (task) => {
    const { data, error } = await createTask(task);

    if (error) throw error;

    setTasks(previous => [data, ...previous]);

    return data;
  };


  // UPDATE
  const editTask = async (id, updates) => {
    const { data, error } = await updateTask(id, updates);

    if (error) throw error;

    setTasks(previous =>
      previous.map(task =>
        task.id === id ? data : task
      )
    );

    return data;
  };


  // TOGGLE COMPLETION
  
const changeTaskStatus = async (id, completed) => {
  // 1. Save the previous state for rollback
  const previousTasks = tasks;

  // 2. Update UI immediately
  setTasks(currentTasks =>
    currentTasks.map(task =>
      task.id === id
        ? { ...task, completed }
        : task
    )
  );

  try {
    // 3. Update Supabase in the background
    const { error } = await toggleTask(id, completed);

    if (error) throw error;

  } catch (error) {
    // 4. Revert UI if database update fails
    setTasks(previousTasks);

    throw error;
  }
};



  // DELETE
  const removeTask = async (id) => {
    const { error } = await deleteTask(id);

    if (error) throw error;

    setTasks(previous =>
      previous.filter(task => task.id !== id)
    );
  };


  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    editTask,
    changeTaskStatus,
    removeTask,
  };
}
