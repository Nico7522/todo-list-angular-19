import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, map, of, Subject, switchMap, take } from 'rxjs';
import { Priority } from '../../../../enums/priority.enum';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { Task } from '../../../../models/task.model';
import { FakeTasksProvider } from '../../../../gateways/adapters/fake-tasks.provider';
import { MessageService } from '../../../../services/message.service';
import { Response } from '../../../../models/response.model';
import { ConfirmationModalComponent } from '../../../../shared/confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';
import { BaseTaskFormComponent } from '../../../../shared/base-task-form/base-task-form.component';
import { AsyncPipe } from '@angular/common';
import { FakeUsersProvider } from '../../../../gateways/adapters/fake-users.provider';

@Component({
  selector: 'app-edit-task',
  imports: [
    ConfirmationModalComponent,
    ReactiveFormsModule,
    BaseTaskFormComponent,
    AsyncPipe,
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #usersProvider = inject(FakeUsersProvider);

  readonly #formBuilder = inject(FormBuilder);
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);
  users$ = this.#usersProvider.getUsers();
  destroyRef = inject(DestroyRef);
  showModal = signal(false);
  assignUser = signal(false);
  formData = signal<FormData>(new FormData());
  isClosingDateExist = signal(false);
  handleImage(formData: FormData) {
    this.formData.set(formData);
  }
  id = input.required<string>();
  taskId$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.#tasksProvider.getTask(id).pipe(
        map((task) => {
          this.editForm
            .get('status')
            ?.patchValue(task.completed ? 'true' : 'false');
          if (task.userId)
            this.editForm.get('user')?.patchValue(task.userId.toString());
          return task;
        })
      );
    })
  );
  response = signal<Response>('loading');

  onSubmit() {
    const title = this.editForm.get('base.title')?.value;
    const priority = this.editForm.get('base.priorities')?.value;
    const image = this.editForm.get('base.image')?.value;
    const userId = this.editForm.get('user')?.value;
    let completed = this.editForm.get('status')?.value === 'true';
    if (title && (priority || priority === 0)) {
      let task: Partial<Task> = {
        id: +this.id(),
        title: title,
        priority: +priority,
        completed: completed,
        userId: null,
      };
      if (userId) task.userId = +userId;

      if (task.completed && !this.isClosingDateExist()) {
        task.closingDate = new Date();
      }

      if (!task.completed && this.isClosingDateExist()) {
        task.closingDate = null;
      }
      this.#messageService.showLoader();
      this.#tasksProvider
        .edit(+this.id(), task as Partial<Task>)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          switchMap((res) => {
            if (image) {
              return this.#tasksProvider.uploadImage(
                this.formData(),
                +this.id()
              );
            }
            return of(res);
          }),
          catchError((err) => {
            if (err.message === "Erreur lors de l'upload de l'image") {
              this.#messageService.showMessage(
                "Tâche édité mais erreur lors du changement de l'image",
                'error'
              );
            } else {
              this.#messageService.showMessage(err.message, 'error');
            }
            this.#messageService.hideLoader();
            return EMPTY;
          })
        )
        .subscribe((response) => {
          this.#messageService.showMessage(
            'La tâche éditée avec succès.',
            'success'
          );
          this.#messageService.hideLoader();
          if (response) {
            // Set to true to not trigger the confirmation modal and bypass the modal.
            this.isFormUntouched.set(true);
            this.#router.navigate(['/task', this.id()]);
          }
        });
    }
  }
  onAssignUser() {
    this.assignUser.set(!this.assignUser());
  }

  editForm = this.#formBuilder.group({
    status: ['', Validators.required],
    user: [''],
  });

  canQuit$: Subject<boolean> = new Subject();
  // Start to true, so, if the user has not touched the form, he can quit the page withtout trigger the confirmation modal.
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
  ngOnInit() {}

  // After the view init, subscribe to the form and if any value change, formSubmitedAndValid signal is set to false. This will trigger the modal confirmation id the user want to left the page.
  ngAfterViewInit() {
    this.editForm.valueChanges
      .pipe(take(1))
      .subscribe(() => this.isFormUntouched.set(false));
  }
}
