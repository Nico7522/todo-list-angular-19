import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FakeUsersProvider } from '../../../gateways/adapters/fake-users.provider';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { countries } from '../../../services/data';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user.model';
import { UserFormComponent } from '../../../admin/components/users/user-form/user-form.component';

function userNameIsUnique(service: FakeUsersProvider): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return service.getUserByUsername(control.value).pipe(
      take(1),
      map((val) =>
        val ? ({ userNameExistError: true } as ValidationErrors) : null
      )
    );
  };
}

@Component({
  selector: 'app-user-edit',
  imports: [ReactiveFormsModule, AsyncPipe, UserFormComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
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
    console.log(data);

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
