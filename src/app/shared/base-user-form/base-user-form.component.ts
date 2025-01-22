import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { User } from '../../models/user.model';
import { countries } from '../../services/data';
import { map, Observable, of, take } from 'rxjs';
import { UsersProvider } from '../../gateways/ports/users.provider';
function userNameIsUnique(service: UsersProvider): AsyncValidatorFn {
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
  selector: 'app-base-user-form',
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './base-user-form.component.html',
  styleUrl: './base-user-form.component.scss',
})
export class BaseUserFormComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (this.user) {
      this.parentFormGroup.get('base')?.patchValue({
        ...this.user,
      });
    }
  }

  emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  readonly #usersProvider = inject(UsersProvider);
  @Input({ required: true }) controlKey = '';
  @Input() label = '';
  @Input() user: User | null = null;
  parentContainer = inject(ControlContainer);
  countries = countries;
  get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(
      this.controlKey,
      new FormGroup({
        username: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
          asyncValidators: [userNameIsUnique(this.#usersProvider)],
        }),
        name: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        surname: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        email: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.email,
            Validators.pattern(this.emailRegex),
          ],
        }),
        gender: new FormControl('', {
          nonNullable: true,
        }),
        country: new FormControl(countries[0], {
          nonNullable: true,
        }),
      })
    );

    if (this.user) {
      this.parentFormGroup.get('base')?.patchValue({
        ...this.user,
      });
    }
  }
  get usernameRequired() {
    return (
      this.parentFormGroup.get('base.username')?.hasError('required') &&
      this.parentFormGroup.get('base.username')?.dirty
    );
  }

  get usernameTaken() {
    return (
      this.parentFormGroup
        .get('base.username')
        ?.hasError('userNameExistError') &&
      this.parentFormGroup.get('base.username')?.dirty
    );
  }

  get emailRequired() {
    return (
      this.parentFormGroup.get('base.email')?.hasError('required') &&
      this.parentFormGroup.get('base.email')?.dirty
    );
  }
  get emailInvalid() {
    return (
      this.parentFormGroup.get('base.email')?.hasError('pattern') &&
      this.parentFormGroup.get('base.email')?.dirty
    );
  }

  get nameRequired() {
    return (
      this.parentFormGroup.get('base.name')?.hasError('required') &&
      this.parentFormGroup.get('base.name')?.dirty
    );
  }

  get surnameRequired() {
    return (
      this.parentFormGroup.get('base.surname')?.hasError('required') &&
      this.parentFormGroup.get('base.surname')?.dirty
    );
  }
  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey);
    console.log('destroy');
  }
}
