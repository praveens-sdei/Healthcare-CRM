import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatienttodoctorComponent } from './patienttodoctor.component';

describe('PatienttodoctorComponent', () => {
  let component: PatienttodoctorComponent;
  let fixture: ComponentFixture<PatienttodoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatienttodoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatienttodoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
