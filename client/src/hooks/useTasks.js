import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
 
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, completed: 0 });
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTasks(status, search);
      setTasks(data.tasks);
      setCounts(data.counts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, search]);
 
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
 
  const createTask = async (payload) => {
    const task = await api.createTask(payload);
    await fetchTasks();
    return task;
  };
 
  const updateTask = async (id, payload) => {
    await api.updateTask(id, payload);
    await fetchTasks();
  };
 
  const deleteTask = async (id) => {
    await api.deleteTask(id);
    await fetchTasks();
  };
 
  const toggleTask = (id, completed) => updateTask(id, { completed: !completed });
 
  return {
    tasks,
    counts,
    status,
    setStatus,
    search,
    setSearch,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}