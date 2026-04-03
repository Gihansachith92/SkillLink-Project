import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Network } from './pages/network/network';
import { Messages } from './pages/messages/messages';

export const routes: Routes = [
  {path: 'register', component: Register},
  {path: 'login', component: Login},
  {path: 'dashboard', component: Dashboard},
  { path: 'network', component: Network },
  { path: 'messages/:id', component: Messages },
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];
