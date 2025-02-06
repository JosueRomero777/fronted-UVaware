import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';

interface Recommendation {
  idrecomendations: number;
  title: string;
  description: string;
  img: string;
}

@Component({
  selector: 'app-admin-recomendations',
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
  templateUrl: './admin-recomendations.component.html',
  styleUrl: './admin-recomendations.component.css',
})
export class AdminRecomendationsComponent {
  filteredData: any[] = [];
  constructor(private router: Router, private http: HttpClient) {}

  searchValue = '';
  listOfData: Recommendation[] = [];
  newRecommendation: Partial<Recommendation> = {};

  ngOnInit() {
    this.fetchRecommendations();
  }
  
  fetchRecommendations() {
    this.http.get<Recommendation[]>('http://localhost:3000/recomendations').subscribe(
      (data) => {
        this.listOfData = data;
        console.log('List of data:', this.listOfData); // Verifica la estructura de los datos
      }
    );
  }
  

  createRecommendation() {
    this.http.post<Recommendation>('http://localhost:3000/recomendations', this.newRecommendation).subscribe(() => {
      this.fetchRecommendations();
      this.newRecommendation = {};
    });
  }

  deleteRecommendation(id: number) {
    this.http.delete(`http://localhost:3000/recomendations/${id}`).subscribe(() =>
      this.fetchRecommendations()
    );
  }

  filterData() {
    if (!this.searchValue) {
      this.filteredData = [...this.listOfData];  // Si no hay búsqueda, muestra todos los datos
    } else {
      this.filteredData = this.listOfData.filter(item =>
        item.title.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
  
    // Agregar un log para verificar las URLs de las imágenes
    console.log('Filtered Data:', this.filteredData);
  }
  
  
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file); // Se asegura de que el archivo se envíe correctamente
      
      this.http.post<{ imgUrl: string }>('http://localhost:3000/recomendations/upload', formData).subscribe({
        next: (response) => {
          // Aquí agregamos la URL completa a `newRecommendation.img`
          this.newRecommendation.img = `http://localhost:3000${response.imgUrl}`;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        },
        complete: () => {
          console.log('Upload completed');
        }
      });
    }
  }

  
  

  
  
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      document.cookie = 'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    this.invalidateSession();
  }

  invalidateSession() {
    this.http.post('http://localhost:3000/auth/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }
}
