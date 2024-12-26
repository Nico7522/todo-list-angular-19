import { Component, output, signal } from '@angular/core';

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
  filterByTitle(value: string) {
    this.onTitleChange.emit(value);
  }
  filterByStatus(completed: boolean | null) {
    this.onStatusChange.emit(completed);
  }
}
