import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FakeUsersProvider } from '../../../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import { ConfirmationModalComponent } from '../../../../shared/confirmation-modal/confirmation-modal.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, Subject, switchMap, take, tap } from 'rxjs';
import { MessageService } from '../../../../services/message.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { log } from 'node:console';
type Action = {
  show: boolean;
  id?: string;
  action: 'edit' | 'details' | 'create' | 'delete' | null;
};

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, ConfirmationModalComponent, RouterOutlet, RouterModule],

  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #destroyRef = inject(DestroyRef);
  readonly #messageService = inject(MessageService);
  showAnimation = signal(false);
  showDeleteConfirmationModal = signal(false);
  userId = signal('');
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

  scrollToBottom() {
    setTimeout(() => {
      window.scrollTo(
        0,
        window.document.body.scrollHeight - window.innerHeight
      );
      this.showAnimation.set(true);
    }, 100);
  }
  paginate() {
    this.#limit.update((prevLimit) => prevLimit + 25);
  }

  onShowAnimation() {
    this.showAnimation.set(true);
  }
  onShowDeleteConfirmationModal(id: string) {
    this.userId.set(id);
    this.showDeleteConfirmationModal.set(true);
  }

  onConfirm() {
    this.#messageService.showLoader();
    this.#usersProvider
      .delete(this.userId())
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        catchError((err) => {
          this.#messageService.showMessage(err.message, 'error');
          this.#messageService.hideLoader();
          this.showDeleteConfirmationModal.set(false);

          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.#messageService.showMessage('Utilisateur supprimé', 'success');
        this.#messageService.hideLoader();
        this.showDeleteConfirmationModal.set(false);
      });
  }

  onCancel() {
    this.showDeleteConfirmationModal.set(false);
  }

  // A mettre dans le create user
}
