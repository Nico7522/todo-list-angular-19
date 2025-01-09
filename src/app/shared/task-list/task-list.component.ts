import { Component, computed, inject, signal } from '@angular/core';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FilterComponent } from '../filter/filter.component';
import { TaskComponent } from '../task/task.component';
import { Router, RouterModule } from '@angular/router';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { Priority } from '../../enums/priority.enum';
import { FilterService } from '../../services/filter.service';
import { Filter } from '../../models/filter.model';
import { formateDate } from '../../helpers/functions';

@Component({
  selector: 'app-task-list',
  imports: [FilterComponent, TaskComponent, RouterModule, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #filterService = inject(FilterService);
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
  filterByTitle(value: string) {
    this.#tasksProvider.setTitle(value);
  }

  filterByStatus(completed: boolean | null) {
    this.#tasksProvider.setStatus(completed);
  }

  filterByPriority(priority: Priority | null) {
    this.#tasksProvider.setPriority(priority);
  }

  filterByCreationDate(date: string) {
    this.#tasksProvider.setCreatedDate(formateDate(date));
  }

  filterByClosingDate(date: string) {
    this.#tasksProvider.setClosingDate(formateDate(date));
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
