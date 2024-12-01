import {
  Component,
  ComponentRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  readonly #messageService = inject(MessageService);
  message = input.required<string>();
  response = input<'success' | 'error'>();
  canShowMessage = signal(false);
  destoyComponent = this.#messageService.destroyComponent;
  ngOnInit() {
    setTimeout(() => {
      this.canShowMessage.set(true);
    }, 100);
  }

  hideMessage() {
    this.#messageService.hideMessage();
  }
}
