import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { FakeUsersProvider } from '../../../gateways/adapters/fake-users.provider';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { User } from '../../../models/user.model';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-user-edit',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #formBuilder = inject(FormBuilder).nonNullable;
  readonly #messageService = inject(MessageService);
  destroyRef = inject(DestroyRef);
  id = input.required<string>();
  sucessEdit = output<boolean>();
  onSucessEdit() {
    this.sucessEdit.emit(true);
  }
  editForm = this.#formBuilder.group({
    username: ['', Validators.required],
  });
  user$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.#usersProvider.getUser(id).pipe(
        tap((user) => {
          window.scrollTo(
            0,
            window.document.body.scrollHeight - window.innerHeight
          );
          this.editForm.get('username')?.patchValue(user?.username || '');
        })
      );
    })
  );

  onSubmit() {
    let username = this.editForm.get('username')?.value;
    if (username) {
      let user: User = {
        id: this.id(),
        username: username,
      };
      this.#messageService.showLoader();

      this.#usersProvider
        .edit(this.id(), user)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((err) => {
            console.log(err);
            this.#messageService.showMessage(err.message, 'error');
            this.#messageService.hideLoader();

            return EMPTY;
          })
        )
        .subscribe(() => {
          this.#messageService.showMessage(
            "Nom d'utilisateur édité avec succès",
            'success'
          );
          this.#messageService.hideLoader();
          this.onSucessEdit();
        });
    }
  }
}
