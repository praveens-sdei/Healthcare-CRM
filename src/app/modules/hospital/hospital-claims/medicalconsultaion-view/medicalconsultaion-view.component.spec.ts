import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalconsultaionViewComponent } from './medicalconsultaion-view.component';

describe('MedicalconsultaionViewComponent', () => {
  let component: MedicalconsultaionViewComponent;
  let fixture: ComponentFixture<MedicalconsultaionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalconsultaionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalconsultaionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
