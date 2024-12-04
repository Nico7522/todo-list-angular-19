import { Injectable, signal } from '@angular/core';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  #messages = signal<Message[]>([]);
  messages = this.#messages.asReadonly();

  showMessage(message: string, response: 'error' | 'success') {
    this.#messages.update((prev) => [
      ...prev,
      { message, response, canShow: true },
    ]);
  }

  hideMessage() {
    this.#messages.update((prev) => (prev.pop() ? prev : []));
  }
  constructor() {}
}
