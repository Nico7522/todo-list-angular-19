import { Route } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { canQuitGuard } from '../../guards/can-quit.guard';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';

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
      {
        path: 'task/:id/edit',
        canDeactivate: [canQuitGuard],
        component: EditTaskComponent,
      },
    ],
  },
];

export default ADMIN_ROUTES;
