import { RenderMode, ServerRoute } from '@angular/ssr';
import { FakeTasksProvider } from './gateways/adapters/fake-tasks.provider';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender,
  },

  {
    path: 'tasks',
    renderMode: RenderMode.Server,
  },
  {
    path: 'task/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const fakeTasksProvider = inject(FakeTasksProvider);
      const ids: string[] = [];
      await fakeTasksProvider.taskList$.pipe(
        map((todos) => {
          todos.forEach((t) => ids.push(t.id.toString()));
        })
      );
      return ids.map((id) => ({ id }));
    },
  },
];
