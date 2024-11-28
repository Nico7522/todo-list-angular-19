import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';

export abstract class TasksProvider {
  abstract getRandomTasks(): void;
  abstract getTask(id: string): Observable<Task | null>;
  abstract getTasksByUserId(id: number): Observable<Task[]>;
  abstract delete(id: number): Observable<boolean>;
}
