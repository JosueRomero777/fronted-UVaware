import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecomendationsComponent } from './admin-recomendations.component';

describe('AdminRecomendationsComponent', () => {
  let component: AdminRecomendationsComponent;
  let fixture: ComponentFixture<AdminRecomendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecomendationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecomendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
