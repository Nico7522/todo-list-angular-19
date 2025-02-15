import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  switchMap,
  take,
} from 'rxjs';
import { Task } from '../../models/task.model';
import { TasksProvider } from '../ports/tasks.provider';
import { completed, titles, users } from '../../services/data';
import { inject, Injectable, signal } from '@angular/core';
import { CustomError } from '../../models/custom-error.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Priority } from '../../enums/priority.enum';
import {
  generateRandomDate,
  getAssociatedImage,
} from '../../helpers/functions';
import { Filter } from '../../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class FakeTasksProvider extends TasksProvider {
  totalLength = signal(0);
  #filterSav = signal<Filter>({
    title: '',
    status: null,
    startIndex: 0,
    endIndex: 21,
    priority: null,
    creationDate: null,
    closingDate: null,
    dateAsc: true,
  });

  filterSav = this.#filterSav.asReadonly();

  resetFilter() {
    this.#filterSav.update(() => {
      return {
        title: '',
        status: null,
        startIndex: 0,
        endIndex: 21,
        priority: null,
        creationDate: null,
        closingDate: null,
        dateAsc: true,
      };
    });
  }

  updateFilter(data: Partial<Filter>) {
    this.#filterSav.update((prev) => {
      return { ...prev, ...data };
    });
  }

  paginate() {
    this.#filterSav.update((prev) => {
      return { ...prev, endIndex: prev.endIndex + 21 };
    });
  }

  override filter(): Observable<{ tasks: Task[]; isLastPage: boolean }> {
    return this.#taskList$.pipe(
      map((tasks) => {
        this.totalLength.set(tasks.length);
        tasks = tasks.filter((task) => {
          return this.#filterSav().status !== null
            ? task.completed === this.#filterSav().status &&
                task.title
                  .toLowerCase()
                  .includes(this.#filterSav().title.toLowerCase())
            : task.title
                .toLowerCase()
                .includes(this.#filterSav().title.toLowerCase().toLowerCase());
        });

        if (this.#filterSav().priority !== null) {
          tasks = tasks.filter(
            (t) => t.priority === this.#filterSav().priority
          );
        }

        if (this.#filterSav().creationDate !== null) {
          tasks = tasks.filter(
            (t) => t.creationDate >= this.#filterSav().creationDate!
          );
        }

        if (this.#filterSav().closingDate !== null) {
          tasks = tasks.filter((t) =>
            t.closingDate
              ? t.closingDate <= this.#filterSav().closingDate!
              : null
          );
        }

        if (this.#filterSav().dateAsc)
          tasks.sort((a, b) => +b.creationDate - +a.creationDate);
        else tasks.sort((a, b) => +a.creationDate - +b.creationDate);

        tasks = tasks.slice(
          this.#filterSav().startIndex,
          this.#filterSav().endIndex
        );
        return {
          tasks: tasks,
          isLastPage: this.totalLength() === tasks.length,
        };
      })
    );
  }
  readonly #httpClient = inject(HttpClient);
  override uploadImage(formData: FormData, id: number): Observable<any> {
    return this.#httpClient
      .post<any>(`${environment.API_IGM_URL}`, formData)
      .pipe(
        take(1),
        switchMap((res) => {
          return this.#taskList$.pipe(
            take(1),
            map((tasks) => {
              let index = tasks.findIndex((t) => t.id === id);
              if (index !== -1) {
                tasks[index] = { ...tasks[index], imgUrl: res.file.filename };
                return res;
              } else
                throw new CustomError(
                  "L'image n'a pas été modifié car la tâche n'a pas été trouvée",
                  {
                    status: 400,
                  }
                );
            })
          );
        }),
        catchError((err) => {
          throw new CustomError("Erreur lors de l'upload de l'image", {
            status: 400,
          });
        })
      );
  }

  override createWithoutPicture(task: Task): Observable<number> {
    return this.#taskList$.pipe(
      take(1),
      map((tasks) => {
        const previousLength = tasks.length;
        let newTaskList = [...tasks, { ...task, id: tasks.length + 1 }];
        if (previousLength < newTaskList.length) {
          this.#taskList$.next(newTaskList);
          return newTaskList.length;
        } else {
          throw new CustomError("La tâche n'a pas pu être crée", {
            status: 400,
          });
        }
      })
    );
  }
  override create(task: Task, formData: FormData): Observable<number> {
    return this.#taskList$.pipe(
      take(1),
      switchMap((tasks) => {
        return this.uploadImage(formData, task.id).pipe(
          map((res) => {
            task.imgUrl = res.file.filename;
            const previousLength = tasks.length;
            let newTaskList = [...tasks, { ...task, id: tasks.length + 1 }];
            if (previousLength < newTaskList.length) {
              this.#taskList$.next(newTaskList);
              return newTaskList.length;
            } else {
              throw new CustomError(
                res.error || "La tâche n'a pas pu être crée",
                {
                  status: 400,
                }
              );
            }
          })
        );
      })
    );
  }

  override edit(id: number, task: Partial<Task>): Observable<boolean> {
    let newTasksList: Task[] = [];
    return this.#taskList$.pipe(
      take(1),
      map((tasks) => {
        let index = tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...task };
          newTasksList = [...tasks];
          return true;
        } else
          throw new CustomError("La tâche n'a pas pu être modifiée", {
            status: 400,
          });
      })
    );
  }
  override delete(id: number): Observable<boolean> {
    return this.#taskList$.pipe(
      take(1),
      map((tasks) => {
        const initialLength = tasks.length;
        const newTasksList = tasks.filter((task) => task.id !== id);
        if (newTasksList.length < initialLength) {
          this.#taskList$.next(newTasksList);
          return true;
        } else {
          throw new CustomError("La tâche n'a pas pu être supprimée", {
            status: 400,
          });
        }
      })
    );
  }

  override getTasksByUserId(id: number): Observable<Task[]> {
    return this.#taskList$.pipe(
      filter((_) => id !== 0),
      map((tasks) => {
        tasks = tasks.filter((task) => task.userId === id);
        return tasks;
      })
    );
  }
  #taskList$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  taskList$ = this.#taskList$.asObservable();
  getRandomTasks() {
    let todos: Task[] = [];
    let i = 0;
    while (i < 100) {
      let todo: Task = {
        title: titles[Math.floor(Math.random() * titles.length)],
        priority: Math.floor(Math.random() * 3),
        userId: users[Math.floor(Math.random() * users.length)].id,
        id: i,
        completed: completed[Math.floor(Math.random() * completed.length)],
        creationDate: generateRandomDate(),
      };
      todo.imgUrl = getAssociatedImage(todo.title);
      if (todo.completed) {
        todo.closingDate = new Date();
      }
      todos.push(todo);
      i++;
    }
    this.#taskList$.next(todos);
  }
  override getTask(id: string): Observable<Task> {
    return this.#taskList$.pipe(
      filter(() => id !== ''),
      map((tasks) => {
        let task = tasks.find((t) => t.id.toString() === id);
        if (task) return task;
        else {
          throw new CustomError('Task not found', {
            status: 404,
          });
        }
      })
    );
  }
}
