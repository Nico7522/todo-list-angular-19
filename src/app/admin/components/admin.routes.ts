import { Route } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { canQuitGuard } from '../../guards/can-quit.guard';

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
        canDeactivate: [canQuitGuard],
        component: TaskFormComponent,
      },
    ],
  },
];

export default ADMIN_ROUTES;
