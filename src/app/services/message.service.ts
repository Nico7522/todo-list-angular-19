import { Injectable, signal } from '@angular/core';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  #message = signal<Message>({
    message: '',
    canShow: false,
  });
  message = this.#message.asReadonly();

  #destroyComponent = signal(false);
  destroyComponent = this.#destroyComponent.asReadonly();

  showMessage(message: string, response: 'error' | 'success') {
    this.#destroyComponent.set(false);
    this.#message.set({
      message,
      response,
      canShow: true,
    });
  }

  hideMessage() {
    this.#destroyComponent.set(true);
    this.#message.set({
      message: '',
      canShow: false,
    });
  }
  constructor() {}
}
