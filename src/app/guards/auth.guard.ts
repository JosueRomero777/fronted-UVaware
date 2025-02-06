import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  getCookie(name: string): string | null {
    console.log('Checking cookies:', document.cookie); // Ver todas las cookies
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  canActivate(): boolean {
    // Verifica si estamos en el navegador y si las cookies no existen
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getCookie('token');
      console.log('Token in cookie:', token); // Ver si realmente existe la cookie
  
      if (!token) {
        console.warn('No token found, redirecting to /admin');
        this.router.navigate(['/admin']);
        return false;
      }
    }

    return true;
  }
}
