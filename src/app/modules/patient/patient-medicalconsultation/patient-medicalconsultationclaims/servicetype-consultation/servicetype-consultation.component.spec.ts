import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeConsultationComponent } from './servicetype-consultation.component';

describe('ServicetypeConsultationComponent', () => {
  let component: ServicetypeConsultationComponent;
  let fixture: ComponentFixture<ServicetypeConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
