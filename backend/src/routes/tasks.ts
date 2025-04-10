import { Router, Request, Response } from 'express';
import Task from '../models/Task';

const router = Router();

interface TaskRequestBody {
  title: string;
  description?: string;
  completed?: boolean;
}

// Get all tasks
router.get('/', async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json(tasks);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      res.status(500).json({ 
        message: 'Failed to fetch tasks',
        error: err.message 
      });
    }
  });

// Create new task
router.post('/', async (req: Request<{}, {}, TaskRequestBody>, res: Response) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task' });
  }
});


// Update task
router.put('/:id', async (req: Request<{ id: string }, {}, TaskRequestBody>, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting task' });
  }
});

export default router;