import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalManagelabImagingComponent } from './hospital-managelab-imaging.component';

describe('HospitalManagelabImagingComponent', () => {
  let component: HospitalManagelabImagingComponent;
  let fixture: ComponentFixture<HospitalManagelabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalManagelabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalManagelabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
