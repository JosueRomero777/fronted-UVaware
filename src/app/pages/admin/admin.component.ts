import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// NG Zorro modules
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    NzCheckboxModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility() {
    const passwordField = document.getElementById('password') as HTMLInputElement;
    const showPasswordCheckbox = document.getElementById('showPassword') as HTMLInputElement;

    if (showPasswordCheckbox.checked) {
      passwordField.type = 'text'; // Mostrar la contraseña
    } else {
      passwordField.type = 'password'; // Ocultar la contraseña
    }
  }

  onSubmit() {
    this.http.post(
      'http://localhost:3000/auth/login',
      { email: this.email, password: this.password },
      { withCredentials: true } // Permite que las cookies sean enviadas
    ).subscribe({
      next: (response) => {
        console.log('Login success:', response); // Ver si el backend responde correctamente
        this.router.navigate(['/admin-recomendations']); // Redirigir al panel de recomendaciones
      },
      error: (err) => {
        console.error('Login failed:', err); // Imprimir el error si la autenticación falla
        this.error = 'Invalid email or password'; // Mensaje de error
      }
    });
  }
}

