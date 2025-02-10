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
  img: string; // Ahora solo almacenará la URL de la imagen
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
  styleUrls: ['./admin-recomendations.component.css'],
})
export class AdminRecomendationsComponent {
  filteredData: Recommendation[] = [];
  searchValue = '';
  listOfData: Recommendation[] = [];
  recommendations: Recommendation[] = [];
  newRecommendation: Partial<Recommendation> = { title: '', description: '', img: '' };

  selectedFile: File | null = null;
  isEditing = false;
  editingId: number | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.fetchRecommendations();
  }

  fetchRecommendations() {
    this.http.get<Recommendation[]>('http://localhost:3000/recomendations').subscribe((data) => {
      this.listOfData = data;
      this.filteredData = [...this.listOfData];
      this.recommendations = data;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      // Crear una previsualización de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newRecommendation.img = e.target.result; // ✅ Actualiza la previsualización
      };
      reader.readAsDataURL(file);
    }
  }
  

  createRecommendation() {
    if (!this.newRecommendation.title || !this.newRecommendation.description) {
      console.error('Title and description are required!');
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    formData.append('title', this.newRecommendation.title || '');
    formData.append('description', this.newRecommendation.description || '');

    this.http.post<{ imageUrl: string; recommendation: Recommendation }>(
      'http://localhost:3000/recomendations', formData
    ).subscribe((response) => {
      this.newRecommendation.img = response.imageUrl; // ✅ Guarda solo la URL de la imagen
      this.fetchRecommendations();
      this.resetForm();
    });
  }

  editRecommendation(data: Recommendation) {
    this.newRecommendation = { ...data };
    this.isEditing = true;
    this.editingId = data.idrecomendations;
  }

  updateRecommendation() {
    if (this.editingId !== null) {
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      formData.append('title', this.newRecommendation.title || '');
      formData.append('description', this.newRecommendation.description || '');

      this.http.put<{ imageUrl?: string }>(
        `http://localhost:3000/recomendations/${this.editingId}`, formData
      ).subscribe((response) => {
        if (response.imageUrl) {
          this.newRecommendation.img = response.imageUrl; // ✅ Actualiza solo si hay nueva imagen
        }
        this.fetchRecommendations();
        this.resetForm();
      });
    }
  }

  deleteRecommendation(id: number) {
    this.http.delete(`http://localhost:3000/recomendations/${id}`).subscribe(() => this.fetchRecommendations());
  }

  filterData() {
    this.filteredData = this.searchValue
      ? this.listOfData.filter((item) => item.title.toLowerCase().includes(this.searchValue.toLowerCase()))
      : [...this.listOfData];
  }

  resetForm() {
    this.newRecommendation = { title: '', description: '', img: '' };
    this.isEditing = false;
    this.editingId = null;
    this.selectedFile = null;

    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  cancelEdit() {
    this.resetForm(); // Restablece el formulario
  }
  


  logout() {
    localStorage.removeItem('token');
    document.cookie = 'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.invalidateSession();
  }


  invalidateSession() {
    this.http.post('http://localhost:3000/auth/logout', {}, { withCredentials: true }).subscribe(() => {
      this.router.navigate(['/admin']);
    });
  }
}
