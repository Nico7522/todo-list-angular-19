import { Component, inject, signal } from '@angular/core';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { toObservable } from '@angular/core/rxjs-interop';
import { FilterComponent } from '../filter/filter.component';
import { TaskComponent } from '../task/task.component';
import { Router, RouterModule } from '@angular/router';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  shareReplay,
  switchMap,
} from 'rxjs';

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
  isFilterOpen = signal(false);
  showFilter = signal(false);
  isLastPage = signal(false);

  body = document.querySelector('body') as HTMLBodyElement;
  paginate() {
    this.#tasksProvider.paginate();
  }

  tasks = toObservable(this.#tasksProvider.filterSav).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((_) => {
      return this.#tasksProvider.filter();
    }),
    shareReplay()
  );

  openFilter() {
    this.isFilterOpen.set(true);
    this.showFilter.set(true);
    this.body.classList.add('overflow-hidden');
  }

  onCloseFilter() {
    this.showFilter.set(false);
    this.body.classList.remove('overflow-hidden');
  }
  ngOnInit() {}
}
