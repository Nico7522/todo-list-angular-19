import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { canNavigateGuard } from './guards/can-navigate.guard';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TasksComponent, canActivate: [canNavigateGuard] },
  {
    path: 'task/:id',
    component: TaskDetailsComponent,
    canActivate: [canNavigateGuard],
  },
  {
    path: 'my-tasks',
    component: MyTasksComponent,
    canActivate: [canNavigateGuard],
  },
];
