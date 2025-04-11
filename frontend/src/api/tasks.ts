import axios from 'axios';
import { Task } from '../types/task';

const API_URL = '/api/tasks';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/');
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    throw new Error(
      err.response?.data?.message || 
      err.message || 
      'Failed to fetch tasks'
    );
  }
};

export const createTask = async (
  task: Omit<Task, '_id' | 'completed' | 'createdAt' | 'updatedAt'>
): Promise<Task> => {
  try {
    const response = await api.post<Task>('/', task);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    throw new Error(
      err.response?.data?.message || 
      err.message || 
      'Failed to create task'
    );
  }
};

export const updateTask = async (
  id: string,
  task: Partial<Task>
): Promise<Task> => {
  try {
    const response = await api.put<Task>(`/${id}`, task);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    throw new Error(
      err.response?.data?.message || 
      err.message || 
      'Failed to update task'
    );
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/${id}`);
  } catch (error: unknown) {
    const err = error as ApiError;
    throw new Error(
      err.response?.data?.message || 
      err.message || 
      'Failed to delete task'
    );
  }
};