import { Component, output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-user-modal',
  imports: [ReactiveFormsModule, FormsModule],
  host: {
    class:
      'fixed inset-0 left-0 top-0 w-96 h-40 m-auto shadow-xl modal-animation flex flex-col overflow-hidden z-10 bg-default rounded-md border-2',
  },
  templateUrl: './create-user-modal.component.html',
  styleUrl: './create-user-modal.component.scss',
})
export class CreateUserModalComponent {
  username: string = '';
  close = output();
  submit = output<string>();
  onSubmit() {
    this.submit.emit(this.username);
  }

  cancel() {
    this.close.emit();
  }
}
