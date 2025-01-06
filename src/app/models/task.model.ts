import { Priority } from '../enums/priority.enum';

export interface Task {
  userId: number | null;
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  imgUrl?: string;
  creationDate: Date;
  closingDate?: Date | null;
}
