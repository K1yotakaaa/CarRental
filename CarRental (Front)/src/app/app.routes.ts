import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Cars } from './cars/cars';
import { Service } from './service/service';
import { Login } from './login/login';
import { Profile } from './profile/profile';
import { authGuard } from './guards/auth.guards';
import { DealerCars } from './dealer-cars/dealer-cars';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'cars',
    component: Cars,
  },
  {
    path: 'service',
    component: Service,
    canActivate: [authGuard],
  },
  {
    path: 'service/:dealer',
    component: DealerCars,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'profile',
    component: Profile,
  },
];
