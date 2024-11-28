import { Component, inject, signal } from '@angular/core';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';

@Component({
  selector: 'app-filter',
  host: {
    class: 'flex text-white items-center p-5 ml-16 gap-2',
  },
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  #tasksProvider = inject(FakeTasksProvider);
  search = signal('');

  filterByTitle(value: string) {
    this.search.set(value);
    this.#tasksProvider.filterByTitle(value);
  }
  filterByStatus(completed: boolean | null) {
    this.#tasksProvider.filterByStatus(completed);
  }
}
