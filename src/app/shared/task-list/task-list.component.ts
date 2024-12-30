import { Component, computed, inject, signal } from '@angular/core';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FilterComponent } from '../filter/filter.component';
import { TaskComponent } from '../task/task.component';
import { Router, RouterModule } from '@angular/router';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import { map, switchMap } from 'rxjs';
import { Priority } from '../../enums/priority.enum';

@Component({
  selector: 'app-task-list',
  imports: [FilterComponent, TaskComponent, RouterModule, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #router = inject(Router);
  role = this.#usersProvider.role;
  onHomePage = this.#router.url.includes('list');
  title = signal('');
  status = signal<boolean | null>(null);
  search = signal('');
  startIndex = signal(0);
  endIndex = signal(21);
  filter = signal<{
    title: string;
    status: boolean | null;
    startIndex: number;
    endIndex: number;
    priority: Priority | null;
  }>({
    title: '',
    status: null,
    startIndex: 0,
    endIndex: 21,
    priority: null,
  });
  paginate() {
    this.filter.update((prev) => {
      return { ...prev, endIndex: prev.endIndex + 21 };
    });
  }
  filterByTitle(value: string) {
    this.filter.update((prev) => {
      return { ...prev, title: value };
    });
  }

  filterByStatus(completed: boolean | null) {
    this.filter.update((prev) => {
      return { ...prev, status: completed };
    });
  }

  filterByPriority(priority: Priority | null) {
    this.filter.update((prev) => {
      return { ...prev, priority: priority };
    });
  }

  tasks = toObservable(this.filter).pipe(
    switchMap((_) => {
      return this.#tasksProvider.filter(
        this.filter().title,
        this.filter().status,
        this.filter().priority,
        this.filter().startIndex,
        this.filter().endIndex
      );
    })
  );

  ngOnInit() {}
}
