import { Route } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';

const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    component: PanelComponent,
    children: [
      {
        path: 'tasks',
        component: TaskListComponent,
      },
      {
        path: 'create',
        component: TaskFormComponent,
      },
    ],
  },
];

export default ADMIN_ROUTES;
