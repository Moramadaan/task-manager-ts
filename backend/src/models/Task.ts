import { Document, Schema, model } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default model<ITask>('Task', taskSchema);