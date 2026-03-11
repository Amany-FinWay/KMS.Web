import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
<<<<<<< HEAD
import { UserAdminComponent } from './features/user-admin/user-admin.component';
import { IntegrationsComponent } from './features/integrations/integrations.component';
import { LoginComponent } from './core/login/login.component';
=======
>>>>>>> 8fb24e7761d248c67c7bbfae19f8a9b369a0f3e1

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
<<<<<<< HEAD
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'admin', component: UserAdminComponent},
      { path: 'integrations', component: IntegrationsComponent },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
=======
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
>>>>>>> 8fb24e7761d248c67c7bbfae19f8a9b369a0f3e1
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];