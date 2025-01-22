import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { countries } from '../../../services/data';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user.model';
import { BaseUserFormComponent } from '../../../shared/base-user-form/base-user-form.component';
import { UsersProvider } from '../../../gateways/ports/users.provider';

@Component({
  selector: 'app-user-edit',
  imports: [ReactiveFormsModule, AsyncPipe, BaseUserFormComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  readonly #usersProvider = inject(UsersProvider);
  readonly #messageService = inject(MessageService);
  countries = countries;
  destroyRef = inject(DestroyRef);
  id = input.required<string>();
  sucessEdit = output<boolean>();
  onSucessEdit() {
    this.sucessEdit.emit(true);
  }

  editForm = new FormGroup({});

  user$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.#usersProvider.getUser(id);
    })
  );

  onSubmit() {
    let data = this.editForm.get('base')?.value as unknown as User;
    this.#messageService.showLoader();
    this.#usersProvider
      .edit(this.id(), data)
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
