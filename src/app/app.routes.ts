import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { UserAdminComponent } from './features/user-admin/user-admin.component';
import { IntegrationsComponent } from './features/integrations/integrations.component';
import { LoginComponent } from './core/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => 
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'admin', component: UserAdminComponent},
      { path: 'integrations', component: IntegrationsComponent },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];