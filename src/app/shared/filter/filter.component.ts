import { Component, output, signal } from '@angular/core';
import { Priority } from '../../enums/priority.enum';
import { Datepicker } from 'flowbite-datepicker';

@Component({
  selector: 'app-filter',
  host: {
    class: '',
  },
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  title = signal('');
  onTitleChange = output<string>();
  onStatusChange = output<boolean | null>();
  onPriorityChange = output<Priority | null>();
  onCreationDateChange = output<string>();
  onClosingDateChange = output<string>();

  onCloseFilter = output();

  selectedStatus = signal<boolean | null>(null);

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
