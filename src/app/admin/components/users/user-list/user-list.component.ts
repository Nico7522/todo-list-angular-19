import {
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FakeUsersProvider } from '../../../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import { UserDetailsComponent } from '../../../../components/users/user-details/user-details.component';
import { UserEditComponent } from '../../../../components/users/user-edit/user-edit.component';
import { ConfirmationModalComponent } from '../../../../shared/confirmation-modal/confirmation-modal.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  map,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { MessageService } from '../../../../services/message.service';
import { CreateUserModalComponent } from '../create-user-modal/create-user-modal.component';
type Action = {
  show: boolean;
  id?: string;
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

  #limit = signal(25);
  pseudo = signal('');
  #subject$ = new Subject<void>();
  filterByUsername(word: string) {
    this.#subject$.next();
    this.#usersProvider
      .getUserByUsername(word)
      .pipe(
        take(1),
        tap((user) => {
          if (user) this.showDetails(user.id);
          else
            this.#messageService.showMessage(
              'Aucun utilisateur avec ce pseudo',
              'error'
            );
        }),
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  users$ = toObservable(this.#limit).pipe(
    switchMap(() =>
      this.#usersProvider
        .getUsers()
        .pipe(map((users) => users.slice(0, this.#limit())))
    )
  );

  action = signal<Action>({ show: false, id: '', action: 'details' });

  paginate() {
    this.#limit.update((prevLimit) => prevLimit + 25);
  }

  showDetails(id: string) {
    this.action.set({ show: true, id, action: 'details' });
  }

  showEditForm(id: string) {
    this.action.set({ show: true, id, action: 'edit' });
  }

  onSucessEdit() {
    this.action.set({ show: false, action: null });
  }

  showDeleteConfirmation(id: string) {
    this.action.set({ show: true, id, action: 'delete' });
  }

  onConfirm() {
    this.#messageService.showLoader();

    this.#usersProvider
      .delete(this.action().id!)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        catchError((err) => {
          console.log('ici');

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
