import { computed, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, merge, Observable, of, switchMap } from 'rxjs';
import { completed, images, titles } from './data';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskssService {
  constructor() {}
  // Generate a array of random tasks.
  getRandomTaskss(): Observable<Task[]> {
    let Taskss: Task[] = [];
    let i = 0;
    while (i < 100) {
      let Tasks: Task = {
        title: titles[Math.floor(Math.random() * titles.length)],
        imgUrl: images[Math.floor(Math.random() * images.length)],
        userId: 1,
        id: 1,
        completed: completed[Math.floor(Math.random() * completed.length)],
      };

      Taskss.push(Tasks);
      i++;
    }

    return of(Taskss);
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
  #filteredTasks$ = toObservable(this.#filterByStatus).pipe(
    switchMap((value) =>
      this.getRandomTaskss().pipe(
        map((Taskss) => {
          Taskss =
            this.#filterByStatus() !== null
              ? Taskss.filter((t) => t.completed === value)
              : Taskss;
          return Taskss;
        })
      )
    )
  );

  #filteredTasks = toSignal(this.#filteredTasks$, {
    initialValue: null,
  });

  // return tasks array filtered by status, and apply a filter on the title if something has been entered in the search bar.
  filteredTasks = computed(() =>
    this.#filteredTasks()?.filter((t) =>
      t.title.toLowerCase().includes(this.#searchByTitle().toLowerCase())
    )
  );
}
