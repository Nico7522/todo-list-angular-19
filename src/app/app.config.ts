import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { TasksProvider } from './gateways/ports/tasks.provider';
import { FakeTasksProvider } from './gateways/adapters/fake-tasks.provider';
import { UsersProvider } from './gateways/ports/users.provider';
import { FakeUsersProvider } from './gateways/adapters/fake-users.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    { provide: TasksProvider, useClass: FakeTasksProvider },
    { provide: UsersProvider, useClass: FakeUsersProvider },
  ],
};
