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
        path: 'map',
        loadComponent: () =>
          import('./features/map-view/map-view.component').then(
            (m) => m.MapViewComponent,
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/transactions/transactions.component').then(
            (m) => m.TransactionsComponent,
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
      {
        path: 'deployment',
        loadComponent: () =>
          import('./features/deployment/deployment.component').then(
            (m) => m.DeploymentComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then(
            (m) => m.ReportsComponent,
          ),
      },
      {
        path: 'lockers',
        loadComponent: () =>
          import('./features/smart-locker-management/smart-locker-management.component')
            .then((m) => m.SmartLockerManagementComponent),
      },
      {
        path: 'digital-signage',
        loadComponent: () =>
          import('./features/digital-signage/digital-signage.component').then(
            (m) => m.DigitalSignageComponent,
          ),
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    ],
  },

  { path: '**', redirectTo: 'login' },
];
