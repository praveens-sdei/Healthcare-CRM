import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatienttohospitalComponent } from './patienttohospital.component';

describe('PatienttohospitalComponent', () => {
  let component: PatienttohospitalComponent;
  let fixture: ComponentFixture<PatienttohospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatienttohospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatienttohospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
