import { Route } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { canQuitGuard } from '../../guards/can-quit.guard';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { TaskListComponent } from '../../shared/task-list/task-list.component';
import { CreateUserModalComponent } from './users/create-user-modal/create-user-modal.component';
import { UserEditComponent } from '../../components/users/user-edit/user-edit.component';
import { UserDetailsComponent } from '../../components/users/user-details/user-details.component';

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
        children: [
          {
            path: 'create',
            component: CreateUserModalComponent,
          },
          {
            path: ':id/edit',
            component: UserEditComponent,
          },
          {
            path: ':id/details',
            component: UserDetailsComponent,
          },
        ],
      },
    ],
  },
];

export default ADMIN_ROUTES;
