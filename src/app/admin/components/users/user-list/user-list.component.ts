import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FakeUsersProvider } from '../../../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import { UserDetailsComponent } from '../../../../components/users/user-details/user-details.component';
import { UserEditComponent } from '../../../../components/users/user-edit/user-edit.component';
import { ConfirmationModalComponent } from '../../../../shared/confirmation-modal/confirmation-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { MessageService } from '../../../../services/message.service';
import { CreateUserModalComponent } from '../create-user-modal/create-user-modal.component';
type Action = {
  show: boolean;
  id?: number;
  action: 'edit' | 'details' | 'create' | 'delete' | null;
};

@Component({
  selector: 'app-user-list',
  imports: [
    AsyncPipe,
    UserDetailsComponent,
    UserEditComponent,
    ConfirmationModalComponent,
    CreateUserModalComponent,
  ],

  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #destroyRef = inject(DestroyRef);
  readonly #messageService = inject(MessageService);
  users$ = this.#usersProvider.getUsers();
  action = signal<Action>({ show: false, id: 0, action: 'details' });
  showDetails(id: number) {
    this.action.set({ show: true, id, action: 'details' });
  }

  showEditForm(id: number) {
    this.action.set({ show: true, id, action: 'edit' });
  }

  onSucessEdit() {
    this.action.set({ show: false, action: null });
  }

  showDeleteConfirmation(id: number) {
    this.action.set({ show: true, id, action: 'delete' });
  }

  onConfirm() {
    this.#messageService.showLoader();

    this.#usersProvider
      .delete(this.action().id!)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        catchError((err) => {
          this.action.set({ show: false, action: null });
          this.#messageService.showMessage(err.message, 'error');
          this.#messageService.hideLoader();

          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.action.set({ show: false, action: null });
        this.#messageService.showMessage('Utilisateur supprimé', 'success');
        this.#messageService.hideLoader();
      });
  }

  onCancel() {
    this.action.set({ show: false, action: null });
  }

  showCreateForm() {
    this.action.set({ show: true, action: 'create' });
  }

  onSubmit(username: string) {
    this.#messageService.showLoader();

    this.#usersProvider
      .createUserAdmin(username)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        catchError((err) => {
          this.action.set({ show: false, action: null });
          this.#messageService.showMessage(err.message, 'error');
          this.#messageService.hideLoader();

          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.action.set({ show: false, action: null });
        this.#messageService.showMessage('Utilisateur crée', 'success');
        this.#messageService.hideLoader();
      });
  }
}
