import { Component, inject, linkedSignal, output, signal } from '@angular/core';
import { Priority } from '../../enums/priority.enum';
import { Datepicker } from 'flowbite-datepicker';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { formateDate } from '../../helpers/functions';

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

  onCloseFilter = output();

  resetFilter() {
    this.#tasksProvider.resetFilter();
    this.title.set('');
    this.selectedStatus.set(null);
    this.prioritySelected.set('all');
    this.selectedCreationDate.set('');
    this.selectedClosingDate.set('');

    const creationDatePicker = document.getElementById('creationDatePicker');
    const closingDatePicker = document.getElementById('closingDatePicker');
    if (creationDatePicker) {
      (creationDatePicker as HTMLInputElement).value = '';
    }
    if (closingDatePicker) {
      (closingDatePicker as HTMLInputElement).value = '';
    }
  }

  closeFilter() {
    this.onCloseFilter.emit();
  }

  filterByTitle(title: string) {
    this.#tasksProvider.updateFilter({ title });
  }

  filterByStatus(status: boolean | null) {
    this.selectedStatus.set(status);
    this.#tasksProvider.updateFilter({ status });
  }

  filterByPriority(priority: string) {
    if (+priority in Priority) {
      this.#tasksProvider.updateFilter({ priority: +priority });
    } else {
      this.#tasksProvider.updateFilter({ priority: null });
    }
  }

  filterByCreationDate(date: string) {
    this.#tasksProvider.updateFilter({ creationDate: formateDate(date) });
  }

  filterByClosingDate(date: string) {
    this.#tasksProvider.updateFilter({ closingDate: formateDate(date) });
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
