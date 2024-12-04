import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseTaskFormComponent } from '../../../shared/base-task-form/base-task-form.component';
import { Task } from '../../../models/task.model';
import { FakeUsersProvider } from '../../../gateways/adapters/fake-users.provider';
import { FakeTasksProvider } from '../../../gateways/adapters/fake-tasks.provider';
import { take } from 'rxjs';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule, BaseTaskFormComponent],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
})
export class CreateTaskComponent {
  #fb = inject(FormBuilder).nonNullable;
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #tasksProvider = inject(FakeTasksProvider);

  taskForm = this.#fb.group({ test: '' });
  userId = this.#usersProvider.currentUser()?.id;
  onSubmit() {
    if (this.taskForm.valid) {
      let val = this.taskForm.getRawValue();
      const title = this.taskForm.get('base.title')?.value;
      const priority = this.taskForm.get('base.priorities')?.value;

      if (title && priority && this.userId) {
        let task: Task = {
          id: 0,
          title: title,
          priority: +priority,
          completed: false,
          userId: this.userId,
        };
        this.#tasksProvider
          .create(task)
          .pipe(take(1))
          .subscribe((r) => console.log(r));
      }
    }
  }
}
