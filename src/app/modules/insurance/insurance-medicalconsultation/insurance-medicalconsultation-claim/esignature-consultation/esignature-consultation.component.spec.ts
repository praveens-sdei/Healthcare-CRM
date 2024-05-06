import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureConsultationComponent } from './esignature-consultation.component';

describe('EsignatureConsultationComponent', () => {
  let component: EsignatureConsultationComponent;
  let fixture: ComponentFixture<EsignatureConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
