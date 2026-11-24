
import { supabase } from '../lib/supabase';

// READ: Fetch all tasks belonging to the user

export const getTasks = async () => {
  return await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
};


// CREATE: Add a new task

export const createTask = async (task) => {
  return await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      user_id: task.userId,
    })
    .select()
    .single();
};


// UPDATE: Modify an existing task

export const updateTask = async (id, updates) => {
  return await supabase
    .from('tasks')
    .update({
      title: updates.title,
      description: updates.description,
    })
    .eq('id', id)
    .select()
    .single();
};


// UPDATE: Toggle completion status

export const toggleTask = async (id, completed) => {
  return await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id)
    .select()
    .single();
};


// DELETE: Remove a task

export const deleteTask = async (id) => {
  return await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
};
