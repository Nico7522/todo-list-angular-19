import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Task } from '../../models/task.model';
import { TasksProvider } from '../ports/tasks.provider';
import { completed, images, titles, users } from '../../services/data';
import { toObservable } from '@angular/core/rxjs-interop';
import { Injectable, signal } from '@angular/core';
import { error } from 'node:console';
import { CustomError } from '../../models/custom-error.model';

@Injectable({
  providedIn: 'root',
})
export class FakeTasksProvider extends TasksProvider {
  override edit(id: number, task: Partial<Task>): Observable<boolean> {
    let newTasksList: Task[] = [];
    let isSuccess: boolean = false;
    this.taskList$
      .pipe(
        map((tasks) => {
          let index = tasks.findIndex((t) => t.id === id);
          if (index !== -1) {
            tasks[index] = { ...tasks[index], ...task };
            newTasksList = [...tasks];
            isSuccess = true;
          }
        })
      )
      .pipe(take(1))
      .subscribe();
    if (isSuccess) {
      this.taskList$.next(newTasksList);
      return of(true);
    } else {
      throw new CustomError('Task not updated', { status: 400 });
    }
  }
  override delete(id: number): Observable<boolean> {
    let newTasksList: Task[] = [];
    let isSuccess = false;
    this.taskList$
      .pipe(
        map((tasks) => {
          let length = tasks.length;
          tasks = tasks.filter((task) => task.id !== id);
          newTasksList = [...tasks];
          if (newTasksList.length < length) isSuccess = true;
          return tasks;
        })
      )
      .pipe(take(1))
      .subscribe();
    if (isSuccess) {
      this.taskList$.next(newTasksList);
      return of(true);
    } else {
      throw new CustomError('Task not deleted', { status: 400 });
    }
  }
  override getTasksByUserId(id: number): Observable<Task[]> {
    return this.taskList$.pipe(
      filter((_) => id !== 0),
      map((tasks) => {
        tasks = tasks.filter((task) => task.userId === id);
        return tasks;
      })
    );
  }
  taskList$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  getRandomTasks() {
    let todos: Task[] = [];
    let i = 0;
    while (i < 100) {
      let todo: Task = {
        title: titles[Math.floor(Math.random() * titles.length)],
        imgUrl: images[Math.floor(Math.random() * images.length)],
        priority: Math.floor(Math.random() * 3),
        userId: users[Math.floor(Math.random() * users.length)].id,
        id: i,
        completed: completed[Math.floor(Math.random() * completed.length)],
      };
      todos.push(todo);
      i++;
    }
    this.taskList$.next(todos);
  }
  override getTask(id: string): Observable<Task> {
    return this.taskList$.pipe(
      filter(() => id !== ''),
      map((tasks) => {
        let task = tasks.find((t) => t.id.toString() === id);
        if (task) return task;
        else {
          throw new CustomError('Task not found', {
            status: 400,
          });
        }
      })
    );
  }

  #filterByStatus = signal<boolean | null>(null);
  filterByStatus(status: boolean | null) {
    this.#filterByStatus.set(status);
  }
  #searchByTitle = signal('');
  filterByTitle(value: string) {
    this.#searchByTitle.set(value);
  }

  // Filter tasks by status. If null return all tasks.
  filteredTasks$ = toObservable(this.#filterByStatus).pipe(
    switchMap((value) => {
      return this.taskList$.pipe(
        map((tasks) => {
          tasks = tasks.filter((t) => {
            if (this.#filterByStatus() !== null) return t.completed === value;
            return t;
          });
          tasks = tasks.filter((t) =>
            t.title.toLowerCase().includes(this.#searchByTitle().toLowerCase())
          );
          return tasks;
        })
      );
    })
  );
}
