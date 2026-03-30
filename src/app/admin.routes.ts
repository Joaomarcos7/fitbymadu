import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdminLogin } from './components/admin/admin-login/admin-login';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { ProductList } from './components/admin/product-list/product-list';
import { ProductForm } from './components/admin/product-form/product-form';
import { SettingsForm } from './components/admin/settings-form/settings-form';

export const adminRoutes: Routes = [
  { path: 'login', component: AdminLogin },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'produtos', component: ProductList },
      { path: 'produtos/novo', component: ProductForm },
      { path: 'produtos/editar/:id', component: ProductForm },
      { path: 'configuracoes', component: SettingsForm },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
