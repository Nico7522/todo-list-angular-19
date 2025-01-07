import { inject, Injectable, signal } from '@angular/core';
import { Message } from '../models/message.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  #messages = signal<Message[]>([]);
  messages = this.#messages.asReadonly();
  #spinnerService = inject(NgxSpinnerService);
  showMessage(message: string, response: 'error' | 'success') {
    this.#messages.update((prev) => [
      ...prev,
      { message, response, canShow: true },
    ]);

    setTimeout(() => {
      this.hideMessage();
    }, 3000);
  }

  hideMessage() {
    this.#messages.update((prev) => (prev.pop() ? prev : []));
  }

  showLoader() {
    this.#spinnerService.show();
  }

  hideLoader() {
    this.#spinnerService.hide();
  }
  constructor() {}
}
