import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalclaimviewComponent } from './medicalclaimview.component';

describe('MedicalclaimviewComponent', () => {
  let component: MedicalclaimviewComponent;
  let fixture: ComponentFixture<MedicalclaimviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalclaimviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalclaimviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
