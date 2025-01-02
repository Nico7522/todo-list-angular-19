import { Component, output, signal } from '@angular/core';
import { Priority } from '../../enums/priority.enum';

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
  filterByTitle(value: string) {
    this.onTitleChange.emit(value);
  }
  filterByStatus(completed: boolean | null) {
    this.onStatusChange.emit(completed);
  }

  filterByPriority(priority: string) {
    if (+priority in Priority) {
      this.onPriorityChange.emit(+priority);
    } else {
      this.onPriorityChange.emit(null);
    }
  }
}
