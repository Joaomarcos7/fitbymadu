import { Routes } from '@angular/router';
import { PublicLayout } from './components/public-layout/public-layout';
import { Home } from './components/home/home';
import { ProductDetail } from './components/product-detail/product-detail';
import { AdminShell } from './components/admin/admin-shell/admin-shell';
import { adminRoutes } from './admin.routes';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'produto/:id', component: ProductDetail },
    ],
  },
  {
    path: 'admin',
    component: AdminShell,
    children: adminRoutes,
  },
];
