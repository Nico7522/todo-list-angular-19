import { canQuitGuard } from '../../guards/can-quit.guard';
import { TaskListComponent } from '../../shared/task-list/task-list.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TasksComponent } from './tasks.component';
import { Route } from '@angular/router';

const TASK_ROUTES: Route[] = [
  {
    path: '',
    component: TasksComponent,
    children: [
      {
        path: 'list',
        component: TaskListComponent,
      },
      {
        path: 'my-tasks',
        component: MyTasksComponent,
      },
      {
        path: 'create',
        canDeactivate: [canQuitGuard],
        component: CreateTaskComponent,
      },
      {
        path: ':id',
        component: TaskDetailsComponent,
      },
      {
        path: ':id/edit',
        canDeactivate: [canQuitGuard],
        component: TaskEditComponent,
      },
    ],
  },
];

export default TASK_ROUTES;
