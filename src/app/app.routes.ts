import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { VendingManagementComponent } from './features/vending/vending-management/vending-management/vending-management.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/user-admin/user-admin.component').then(
            (m) => m.UserAdminComponent,
          ),
      },
      {
        path: 'integrations',
        loadComponent: () =>
          import('./features/integrations/integrations.component').then(
            (m) => m.IntegrationsComponent,
          ),
      },
            
    {
        path: 'vending',
        loadComponent: () =>
          import('./features/vending/vending-management/vending-management/vending-management.component').then(
            (m) => m.VendingManagementComponent,
          ),
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    ],
  },

  { path: '**', redirectTo: 'login' },
];
