import { Component, inject, input, Input, output, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Priority } from '../../enums/priority.enum';

@Component({
  selector: 'app-priority-select',
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PrioritySelectComponent,
    },
  ],
  templateUrl: './priority-select.component.html',
  styleUrl: './priority-select.component.scss',
})
export class PrioritySelectComponent implements ControlValueAccessor {
  selectedPriority = signal(Priority.LOW);
  writeValue(priority: Priority): void {
    this.selectedPriority.set(priority);
  }

  rOnChange = (priority: Priority) => {};
  registerOnChange(rOnChange: any): void {
    this.rOnChange = rOnChange;
  }
  touched = false;
  onTouched = () => {};
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  disabled = false;
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  ngOnInit() {}

  onChange(priority: Priority) {
    this.selectedPriority.set(priority);
    this.rOnChange(priority);
    this.markAsTouched();
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
