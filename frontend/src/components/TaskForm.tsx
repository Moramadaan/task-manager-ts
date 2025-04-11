import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { createTask, updateTask } from '../api/tasks';

interface TaskFormProps {
  task?: Task;
  onTaskCreated?: () => void;
  onTaskUpdated?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onTaskCreated, onTaskUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      // Update existing task
      await updateTask(task._id, { title, description });
      if (onTaskUpdated) onTaskUpdated();
    } else {
      // Create new task
      await createTask({ title, description });
      if (onTaskCreated) onTaskCreated();
    }
    
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
          placeholder="Enter task title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          placeholder="Enter task description"
        />
      </div>
      <div className="flex space-x-3">
        <button 
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          {task ? 'Update Task' : 'Add Task'}
        </button>
        {task && (
          <button 
            type="button" 
            onClick={() => onTaskUpdated && onTaskUpdated()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;