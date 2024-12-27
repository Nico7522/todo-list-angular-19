import { Component, computed, inject, signal } from '@angular/core';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { toSignal } from '@angular/core/rxjs-interop';
import { FilterComponent } from '../filter/filter.component';
import { TaskComponent } from '../task/task.component';
import { Router, RouterModule } from '@angular/router';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';

@Component({
  selector: 'app-task-list',
  imports: [FilterComponent, TaskComponent, RouterModule],
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
  paginate() {
    this.endIndex.update((index) => index + 21);
  }
  filterByTitle(value: string) {
    this.title.set(value);
  }

  filterByStatus(completed: boolean | null) {
    this.status.set(completed);
  }

  filteredTasks = computed(() => {
    return this.tasks()
      ?.slice(this.startIndex(), this.endIndex())
      .filter((task) => {
        return this.status() !== null
          ? task.completed === this.status() &&
              task.title.toLowerCase().includes(this.title().toLowerCase())
          : task.title.toLowerCase().includes(this.title().toLowerCase());
      });
  });

  tasks = toSignal(this.#tasksProvider.taskList$, {
    initialValue: null,
  });

  ngOnInit() {}
}
