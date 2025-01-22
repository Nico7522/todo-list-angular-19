import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav.component';
import { MessageComponent } from './shared/message/message.component';
import { MessageService } from './services/message.service';
import { FlowbiteService } from './services/flowbite.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, MessageComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  readonly #messageService = inject(MessageService);
  messages = this.#messageService.messages;

  constructor() {}
}
