import { Schema, model, Types } from 'mongoose';

export interface ITask {
  title:       string;
  description?: string;
  dueDate?:    Date;
  completed?:  boolean;       
  owner:       Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  title:       { type: String, required: true },
  description: { type: String },
  dueDate:     { type: Date },
  completed:   { type: Boolean, default: false },
  owner:       { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export const Task = model<ITask>('Task', taskSchema);
