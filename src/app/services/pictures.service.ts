import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, of, tap } from 'rxjs';
import { FakeTasksProvider } from '../gateways/adapters/fake-tasks.provider';
import { TasksProvider } from '../gateways/ports/tasks.provider';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class PicturesService extends TasksProvider {
  override getRandomTasks(): Observable<Task[]> {
    return of([]);
  }
  override getTask(): Observable<Task | null> {
    throw new Error('Method not implemented.');
  }
  #httpClient = inject(HttpClient);
}
