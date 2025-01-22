import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { Signal } from '@angular/core';
import { Filter } from '../../models/filter.model';

export abstract class TasksProvider {
  abstract filterSav: Signal<Filter>;
  abstract updateFilter(data: Partial<Filter>): void;
  abstract resetFilter(): void;
  abstract paginate(): void;
  abstract getTasks(): Observable<Task[]>;
  abstract getTask(id: string): Observable<Task>;
  abstract getTasksByUserId(id: string): Observable<Task[]>;
  abstract delete(id: number): Observable<boolean>;
  abstract edit(id: number, task: Partial<Task>): Observable<boolean>;
  abstract create(task: Task, formData: FormData): Observable<number>;
  abstract createWithoutPicture(task: Task): Observable<number>;

  abstract uploadImage(formData: FormData, id: number): Observable<any>;
  abstract filter(): Observable<{ tasks: Task[]; isLastPage: boolean }>;
}
