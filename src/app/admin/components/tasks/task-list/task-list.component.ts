import { Component, computed, inject, signal } from '@angular/core';
import { FakeTasksProvider } from '../../../../gateways/adapters/fake-tasks.provider';
import { toSignal } from '@angular/core/rxjs-interop';
import { FilterComponent } from '../../../../shared/filter/filter.component';
import { TaskComponent } from '../../../../shared/task/task.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-task-list',
  imports: [FilterComponent, TaskComponent, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  search = signal('');
  startIndex = signal(0);
  endIndex = signal(21);
  paginate() {
    this.endIndex.update((index) => index + 21);
  }
  filterByTitle(value: string) {
    this.search.set(value);
    this.#tasksProvider.filterByTitle(value);
  }

  filteredTasks = computed(() =>
    this.tasks()
      ?.slice(this.startIndex(), this.endIndex())
      .filter((t) =>
        t.title.toLowerCase().includes(this.search().toLowerCase())
      )
  );

  tasks = toSignal(this.#tasksProvider.filteredTasks$, {
    initialValue: null,
  });

  filterByStatus(completed: boolean | null) {
    this.#tasksProvider.filterByStatus(completed);
  }

  ngOnInit() {}
}