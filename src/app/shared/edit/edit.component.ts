import { Component, inject, input, signal } from '@angular/core';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';
import { Task } from '../../models/task.model';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';

@Component({
  selector: 'app-edit',
  imports: [ConfirmationModalComponent, RouterModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #router = inject(Router);
  task = input.required<Task>();

  showModal = signal(false);

  onMyTaskPage = input<boolean>(this.#router.url === '/my-tasks');
  currentUser = this.#usersProvider.currentUser;

  onDelete() {
    this.showModal.set(true);
  }

  onEdit() {}

  closeModal() {
    this.showModal.set(false);
  }

  confirmAction() {
    this.showModal.set(false);
    this.#tasksProvider.delete(this.task().id).subscribe();
  }
}
