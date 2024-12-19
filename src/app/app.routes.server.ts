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
    path: 'task',
    renderMode: RenderMode.Server,
  },

  {
    path: 'task/list',
    renderMode: RenderMode.Server,
  },
  {
    path: 'task/my-tasks',
    renderMode: RenderMode.Server,
  },
  {
    path: 'task/create',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/task/:id/edit',
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
  {
    path: 'admin',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/tasks',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/create',
    renderMode: RenderMode.Server,
  },
  {
    path: 'users',
    renderMode: RenderMode.Server,
  },
  {
    path: 'task/:id/edit',
    renderMode: RenderMode.Server,
  },
];
