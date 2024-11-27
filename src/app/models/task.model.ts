import { Priority } from '../enums/priority.enum';

export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  imgUrl?: string;
}
