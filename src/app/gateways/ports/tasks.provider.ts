import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { Priority } from '../../enums/priority.enum';

export abstract class TasksProvider {
  abstract getRandomTasks(): void;
  abstract getTask(id: string): Observable<Task>;
  abstract getTasksByUserId(id: number): Observable<Task[]>;
  abstract delete(id: number): Observable<boolean>;
  abstract edit(id: number, task: Partial<Task>): Observable<boolean>;
  abstract create(task: Task, formData: FormData): Observable<number>;
  abstract uploadImage(formData: FormData, id: number): Observable<any>;
  abstract filter(
    title: string,
    status: boolean | null,
    priority: Priority | null,
    creationDate: Date | null,
    closingDate: Date | null,
    startIndex: number,
    endIndex: number
  ): Observable<{ tasks: Task[]; isLastPage: boolean }>;
}
