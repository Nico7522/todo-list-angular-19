import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav.component';
import { MessageComponent } from './shared/message/message.component';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly #messageService = inject(MessageService);
  messages = this.#messageService.messages;
  title = 'angular-ssr-v19';
}
