import { useState, useEffect, useCallback } from "react";
import taskService from "../services/taskService";
import toast       from "react-hot-toast";

export const useTasks = (projectId) => {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await taskService.getByProject(projectId);
      setTasks(res.data.data.tasks || []);
      setError(null);
    } catch (err) {
      console.error("fetchTasks error:", err.response?.data);
      const msg = err.response?.data?.message || "Failed to load tasks";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data) => {
    const res = await taskService.create(projectId, data);
    const newTask = res.data.data.task;
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (taskId, data) => {
    const res = await taskService.update(taskId, data);
    const updated = res.data.data.task;
    setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
    return updated;
  };

  const updateStatus = async (taskId, status) => {
    await taskService.updateStatus(taskId, status);
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status } : t))
    );
  };

  const deleteTask = async (taskId) => {
    await taskService.delete(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return {
    tasks, loading, error,
    fetchTasks, createTask, updateTask, updateStatus, deleteTask,
  };
};

export default useTasks;