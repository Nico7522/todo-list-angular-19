import { Component, computed, inject, signal } from '@angular/core';
import { FilterComponent } from '../../../shared/filter/filter.component';
import { FakeTasksProvider } from '../../../gateways/adapters/fake-tasks.provider';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskComponent } from '../../../shared/task/task.component';

@Component({
  selector: 'app-task-list',
  imports: [FilterComponent, TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  title = signal('');
  status = signal<boolean | null>(null);
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
