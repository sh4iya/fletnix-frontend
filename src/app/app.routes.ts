import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Shows } from './pages/shows/shows';
import { AuthGuard } from './auth-guard';
import { Signup } from './pages/signup/signup';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'shows', component: Shows },
  { path: 'signup', component: Signup },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

 

