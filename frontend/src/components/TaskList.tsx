import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { getTasks, deleteTask, updateTask } from '../api/tasks';
import TaskForm from './TaskForm';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await getTasks();
      setTasks(tasks);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task.');
      console.error(err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks();
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Task Manager</h2>
        <div className="text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        {editingTask ? (
          <TaskForm task={editingTask} onTaskUpdated={handleTaskUpdated} />
        ) : (
          <TaskForm onTaskCreated={fetchTasks} />
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <AnimatePresence>
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center text-gray-500"
              >
                No tasks found. Add your first task above!
              </motion.div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <motion.li
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleTaskStatus(task)}
                          className={`flex-shrink-0 w-5 h-5 mt-1 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {task.completed && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                        <div>
                          <h3
                            className={`font-medium ${
                              task.completed
                                ? 'line-through text-gray-400'
                                : 'text-gray-800'
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-gray-600 mt-1 text-sm">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center mt-2 space-x-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                task.completed
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {task.completed ? 'Completed' : 'Pending'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                          title="Edit task"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete task"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskList;