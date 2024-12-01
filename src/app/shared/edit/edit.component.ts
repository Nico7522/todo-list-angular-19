import { Component, inject, input, signal } from '@angular/core';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';
import { Task } from '../../models/task.model';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { catchError, EMPTY, startWith, take } from 'rxjs';
import { Response } from '../../models/response.model';
import { MessageComponent } from '../message/message.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-edit',
  imports: [ConfirmationModalComponent, RouterModule, MessageComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);
  task = input.required<Task>();
  response = signal<Response>('loading');
  showModal = signal(false);
  onMyTaskPage = input<boolean>(this.#router.url === '/my-tasks');
  currentUser = this.#usersProvider.currentUser;

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
