import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseTaskFormComponent } from '../../../../shared/base-task-form/base-task-form.component';

@Component({
  selector: 'app-task-form',
  imports: [BaseTaskFormComponent, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  #fb = inject(FormBuilder);
  taskForm = this.#fb.group({});

  onSubmit() {
    if (!this.taskForm.valid) {
      this.taskForm.markAllAsTouched();
    } else {
      console.log(this.taskForm.value);
    }
  }
}
