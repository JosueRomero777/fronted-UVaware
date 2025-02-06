import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica si estamos en el navegador y si el token existe
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      return true;
    } else {
      // Si no está autenticado, redirige a la página de login
      this.router.navigate(['/admin']);
      return false;
    }
  }
}
