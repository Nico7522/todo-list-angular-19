import { Route } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { canQuitGuard } from '../../guards/can-quit.guard';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { TaskListComponent } from '../../shared/task-list/task-list.component';

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
      {
        path: 'users',
        component: UserListComponent,
      },
    ],
  },
];

export default ADMIN_ROUTES;
