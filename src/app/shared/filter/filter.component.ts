import { Component, inject, output, signal } from '@angular/core';
import { Priority } from '../../enums/priority.enum';
import { Datepicker } from 'flowbite-datepicker';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';

@Component({
  selector: 'app-filter',
  host: {
    class: '',
  },
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  title = signal(this.#tasksProvider.filterSav().title);
  selectedStatus = signal<boolean | null>(null);
  prioritySelected = signal(
    this.#tasksProvider.filterSav().priority !== null
      ? this.#tasksProvider.filterSav().priority
      : 'all'
  );
  selectedCreationDate = signal(
    this.#tasksProvider.filterSav().creationDate?.toLocaleDateString()
  );

  selectedClosingDate = signal(
    this.#tasksProvider.filterSav().closingDate?.toLocaleDateString()
  );
  onTitleChange = output<string>();
  onStatusChange = output<boolean | null>();
  onPriorityChange = output<Priority | null>();
  onCreationDateChange = output<string>();
  onClosingDateChange = output<string>();

  onCloseFilter = output();

  closeFilter() {
    this.onCloseFilter.emit();
  }

  filterByTitle(value: string) {
    this.onTitleChange.emit(value);
  }
  filterByStatus(completed: boolean | null) {
    this.onStatusChange.emit(completed);
    this.selectedStatus.set(completed);
  }

  filterByPriority(priority: string) {
    if (+priority in Priority) {
      this.onPriorityChange.emit(+priority);
    } else {
      this.onPriorityChange.emit(null);
    }
  }

  filterByCreationDate(date: string) {
    this.onCreationDateChange.emit(date);
  }

  filterByClosingDate(date: string) {
    this.onClosingDateChange.emit(date);
  }

  ngOnInit() {
    const creationDateInput = document.getElementById('creationDatePicker');
    if (creationDateInput) {
      new Datepicker(creationDateInput, {
        autohide: true,
        format: 'dd/mm/yyyy',
      });
    }

    const closingDateInput = document.getElementById('closingDatePicker');
    if (closingDateInput) {
      new Datepicker(closingDateInput, {
        autohide: true,
        format: 'dd/mm/yyyy',
      });
    }
  }
}
