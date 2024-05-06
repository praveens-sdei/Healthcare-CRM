import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalclaimdetailsComponent } from './medicalclaimdetails.component';

describe('MedicalclaimdetailsComponent', () => {
  let component: MedicalclaimdetailsComponent;
  let fixture: ComponentFixture<MedicalclaimdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalclaimdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalclaimdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
