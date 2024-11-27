import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TodoDetailsComponent } from './components/todo-details/todo-details.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { canNavigateGuard } from './guards/can-navigate.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TasksComponent, canActivate: [canNavigateGuard] },

  {
    path: 'task/:id',
    component: TodoDetailsComponent,
    // canActivate: [canNavigateGuard],
  },
];
