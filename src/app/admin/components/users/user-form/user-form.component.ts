import { Component, inject, input, Input } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../../models/user.model';
import { countries } from '../../../../services/data';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
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
          validators: [Validators.required],
        }),
        gender: new FormControl('', {
          nonNullable: true,
        }),
        country: new FormControl('', {
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
  }
}
