import { Routes } from '@angular/router';
import { WeekViewComponent } from './week/week-view.component';

import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'week', component: WeekViewComponent },
  { path: 'users', component: UsersComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];
