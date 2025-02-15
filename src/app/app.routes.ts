import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { canNavigateGuard } from './guards/can-navigate.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'task',
    canActivate: [canNavigateGuard],
    loadChildren: () => import('./components/tasks/task.routes'),
  },
  {
    path: 'admin',
    canActivate: [canNavigateGuard],

    loadChildren: () => import('./admin/components/admin.routes'),
  },
];
