import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { Categories } from './components/categories/categories';
import { Books } from './components/books/books';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: 'categories', component: Categories, canActivate: [authGuard] },
    { path: 'books', component: Books, canActivate: [authGuard] },
];
