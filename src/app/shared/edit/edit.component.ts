import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Task } from '../../models/task.model';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { catchError, EMPTY } from 'rxjs';
import { Response } from '../../models/response.model';
import { MessageService } from '../../services/message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsersProvider } from '../../gateways/ports/users.provider';
import { TasksProvider } from '../../gateways/ports/tasks.provider';

@Component({
  selector: 'app-edit',
  imports: [ConfirmationModalComponent, RouterModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  readonly #usersProvider = inject(UsersProvider);
  readonly #tasksProvider = inject(TasksProvider);
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);
  destroyRef = inject(DestroyRef);
  task = input.required<Task>();
  response = signal<Response>('loading');
  showModal = signal(false);
  onMyTaskPage = input<boolean>(this.#router.url === '/task/my-tasks');
  onAdminPage = input<boolean>(this.#router.url === '/admin/tasks');
  currentUser = this.#usersProvider.currentUser;
  role = this.#usersProvider.role;
  editUrl = computed(() =>
    this.role() === 'admin'
      ? `/admin/task/${this.task().id}/edit`
      : `/task/${this.task().id}/edit`
  );
  onDelete() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  confirmAction() {
    this.showModal.set(false);
    this.#tasksProvider
      .delete(this.task().id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.#messageService.showMessage('Une erreur est survenue.', 'error');
          return EMPTY;
        })
      )
      .subscribe({
        next: () =>
          this.#messageService.showMessage(
            'La tâche a été supprimée avec succès.',
            'success'
          ),
      });
  }
}
