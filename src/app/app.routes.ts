import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { canNavigateGuard } from './guards/can-navigate.guard';
import { UserDetailsComponent } from './components/users/user-details/user-details.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'profil/:id',
    component: UserDetailsComponent,
    canActivate: [canNavigateGuard],
  },
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
  {
    path: '**',
    component: NotFoundComponent,
  },
];
