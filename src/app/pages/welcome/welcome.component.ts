import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal'; // Importar NzModalModule
import * as bootstrap from 'bootstrap'; // Importa Bootstrap correctamente

interface Recommendation {
  idrecomendations: number;
  title: string;
  description: string;
  img: string; // URL de la imagen
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzModalModule, // Agregar NzModalModule aquí
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})


export class WelcomeComponent implements OnInit {
  isCollapsed = false;
  recommendations: Recommendation[] = [];
  selectedRecommendation: Recommendation | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchRecommendations();
  }

  fetchRecommendations() {
    this.http.get<Recommendation[]>('http://localhost:3000/recomendations').subscribe(
      (data) => {
        this.recommendations = data;
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
      }
    );
  }

  viewRecommendation(recommendation: Recommendation) {
    this.selectedRecommendation = recommendation;
  
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      import('bootstrap').then((bootstrap) => {
        const modalElement = document.getElementById('recommendationModal');
        if (modalElement) {
          const bootstrapModal = new bootstrap.Modal(modalElement);
          bootstrapModal.show();
        }
      });
    }
  }
  
}
