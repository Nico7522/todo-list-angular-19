import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseTaskFormComponent } from '../../../shared/base-task-form/base-task-form.component';
import { Task } from '../../../models/task.model';
import { Subject, take } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { createTask } from '../../../helpers/functions';
import { UsersProvider } from '../../../gateways/ports/users.provider';
import { TasksProvider } from '../../../gateways/ports/tasks.provider';

@Component({
  selector: 'app-create-task',
  imports: [
    ReactiveFormsModule,
    BaseTaskFormComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
})
export class CreateTaskComponent {
  #fb = inject(FormBuilder).nonNullable;
  readonly #usersProvider = inject(UsersProvider);
  readonly #tasksProvider = inject(TasksProvider);
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);

  taskForm = this.#fb.group({});
  userId = this.#usersProvider.currentUser()?.id;
  formData = signal<FormData>(new FormData());
  showModal = signal(false);
  handleImage(formData: FormData) {
    this.formData.set(formData);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const title = this.taskForm.get('base.title')?.value;
      const priority = this.taskForm.get('base.priorities')?.value;
      const image = this.taskForm.get('base.image')?.value;

      if (title && (priority || priority === 0) && this.userId) {
        let task: Task = {
          id: 0,
          title: title,
          priority: +priority,
          completed: false,
          userId: this.userId,
          creationDate: new Date(),
        };
        this.#messageService.showLoader();
        createTask(
          this.#tasksProvider,
          image != null,
          task,
          this.formData(),
          this.#messageService
        ).subscribe({
          next: (taskId) => {
            this.isFormUntouched.set(true);
            this.#messageService.showMessage('La tâche a été crée.', 'success');
            this.#messageService.hideLoader();
            this.#router.navigate(['/task', taskId]);
          },
        });
      }
    }
  }

  canQuit$: Subject<boolean> = new Subject();
  isFormUntouched = signal(true);
  showModalConfirmation() {
    this.showModal.set(true);
  }

  onConfirm() {
    this.canQuit$.next(true);
    this.showModal.set(false);
  }

  onCancel() {
    this.canQuit$.next(false);
    this.showModal.set(false);
  }

  ngAfterViewInit() {
    this.taskForm.valueChanges
      .pipe(take(1))
      .subscribe(() => this.isFormUntouched.set(false));
  }
}
