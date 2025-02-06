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
  filteredData: Recommendation[] = [];
  searchValue = '';
  listOfData: Recommendation[] = [];
  newRecommendation: Partial<Recommendation> = { title: '', description: '', img: '' };
  selectedFile: File | null = null; // Guardar el archivo seleccionado

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.fetchRecommendations();
  }

  fetchRecommendations() {
    this.http.get<Recommendation[]>('http://localhost:3000/recomendations').subscribe((data) => {
      this.listOfData = data;
      this.filteredData = [...this.listOfData];
      console.log('List of recommendations:', this.listOfData);
    });
  }

  // ✅ Selección de archivo y vista previa
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newRecommendation.img = e.target.result; // Mostrar vista previa
      };
      reader.readAsDataURL(file);
    }
  }


  // ✅ Enviar imagen y datos de recomendación en un solo request
createRecommendation() {
  if (!this.selectedFile) {
    alert('Please select an image.');
    return;
  }

  const formData = new FormData();
  formData.append('image', this.selectedFile);
  formData.append('title', this.newRecommendation.title || '');
  formData.append('description', this.newRecommendation.description || '');

  this.http.post<Recommendation>('http://localhost:3000/recomendations', formData).subscribe({
    next: (response) => {
      this.fetchRecommendations();
      this.newRecommendation = { title: '', description: '', img: '' };
      this.selectedFile = null;
    },
    error: (error) => {
      console.error('Error creating recommendation:', error);
    },
  });
}


  // ✅ Guardar la recomendación después de subir la imagen
  saveRecommendation() {
    this.http.post<Recommendation>('http://localhost:3000/recomendations', this.newRecommendation).subscribe(() => {
      this.fetchRecommendations();
      this.newRecommendation = { title: '', description: '', img: '' };
      this.selectedFile = null;
    });
  }

  deleteRecommendation(id: number) {
    this.http.delete(`http://localhost:3000/recomendations/${id}`).subscribe(() => this.fetchRecommendations());
  }

  filterData() {
    this.filteredData = this.searchValue
      ? this.listOfData.filter((item) => item.title.toLowerCase().includes(this.searchValue.toLowerCase()))
      : [...this.listOfData];
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
      console.log('Logout successful');
      this.router.navigate(['/admin']);
    });
  }
}
