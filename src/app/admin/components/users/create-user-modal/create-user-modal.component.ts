import { Component, DestroyRef, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../../../models/user.model';
import { MessageService } from '../../../../services/message.service';
import { FakeUsersProvider } from '../../../../gateways/adapters/fake-users.provider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-create-user-modal',
  imports: [ReactiveFormsModule, FormsModule, UserFormComponent],

  templateUrl: './create-user-modal.component.html',
  styleUrl: './create-user-modal.component.scss',
})
export class CreateUserModalComponent {
  readonly #messageService = inject(MessageService);
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #destroyRef = inject(DestroyRef);
  form = new FormGroup({});

  onSubmit() {
    if (this.form.valid) {
      let data: User = this.form.get('base')?.value as unknown as User;
      this.#messageService.showLoader();
      this.#usersProvider
        .createUserAdmin(data as User)
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
