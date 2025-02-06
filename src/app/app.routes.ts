import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES) },
  { 
    path: 'admin-recomendations', 
    loadChildren: () => import('./pages/admin-recomendations/admin-recomendations.routes').then(m => m.ADMINRECO_ROUTES),
    canActivate: [AuthGuard] // Ruta protegida
  },
  
];
