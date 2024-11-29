import { Component, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  cancel = output();
  confirm = output();
  body = document.querySelector('body') as HTMLBodyElement;

  onCancel() {
    this.cancel.emit();
    this.body.classList.remove('overflow-hidden');
  }

  onConfirm() {
    this.confirm.emit();
    this.body.classList.remove('overflow-hidden');
  }

  ngOnInit() {
    this.body.classList.add('overflow-hidden');
  }
}
