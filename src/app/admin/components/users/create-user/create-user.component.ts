import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseUserFormComponent } from '../../../../shared/base-user-form/base-user-form.component';
import { User } from '../../../../models/user.model';
import { MessageService } from '../../../../services/message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersProvider } from '../../../../gateways/ports/users.provider';
@Component({
  selector: 'app-create-user',
  imports: [ReactiveFormsModule, FormsModule, BaseUserFormComponent],

  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent {
  readonly #messageService = inject(MessageService);
  readonly #usersProvider = inject(UsersProvider);
  readonly #destroyRef = inject(DestroyRef);
  form = new FormGroup({});

  onSubmit() {
    if (this.form.valid) {
      let data: User = this.form.get('base')?.value as unknown as User;
      let newUser: User = {
        ...data,
        id: uuidv4(),
      };
      this.#messageService.showLoader();
      this.#usersProvider
        .createUser(newUser)
        .pipe(
          takeUntilDestroyed(this.#destroyRef),
          catchError((err) => {
            this.#messageService.showMessage(err.message, 'error');
            this.#messageService.hideLoader();
            return EMPTY;
          })
        )
        .subscribe((_) => {
          this.#messageService.showMessage('Utilisateur crée', 'success');
          this.#messageService.hideLoader();
        });
    }
  }
}
