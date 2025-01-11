import { Priority } from '../enums/priority.enum';

export type Filter = {
  title: string;
  status: boolean | null;
  startIndex: number;
  endIndex: number;
  priority: Priority | null;
  creationDate: Date | null;
  closingDate: Date | null;
  dateAsc: boolean;
};
