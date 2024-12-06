import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseTaskFormComponent } from '../../../shared/base-task-form/base-task-form.component';
import { Task } from '../../../models/task.model';
import { FakeUsersProvider } from '../../../gateways/adapters/fake-users.provider';
import { FakeTasksProvider } from '../../../gateways/adapters/fake-tasks.provider';
import { catchError, EMPTY, filter, map, of, switchMap, take, tap } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);
  destroyRef = inject(DestroyRef);
  taskForm = this.#fb.group({});
  userId = this.#usersProvider.currentUser()?.id;
  formData = signal<FormData>(new FormData());
  handleImage(formDate: FormData) {
    this.formData.set(formDate);
  }
  onSubmit() {
    if (this.taskForm.valid) {
      const title = this.taskForm.get('base.title')?.value;
      const priority = this.taskForm.get('base.priorities')?.value;
      const image = this.taskForm.get('base.image')?.value;

      if (title && priority && this.userId) {
        let task: Task = {
          id: 0,
          title: title,
          priority: +priority,
          completed: false,
          userId: this.userId,
        };

        this.#tasksProvider
          .create(task, this.formData())
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError((e) => {
              this.#messageService.showMessage(
                'Une erreur est survenue.',
                'error'
              );
              return EMPTY;
            })
          )
          .subscribe({
            next: (taskId) => {
              this.#messageService.showMessage(
                'La tâche a été crée.',
                'success'
              );
              this.#router.navigate(['/task', taskId]);
            },
          });
      }
    }
  }
}
