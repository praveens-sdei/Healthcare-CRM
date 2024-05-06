import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalComplaintsComponent } from './hospital-complaints.component';

describe('HospitalComplaintsComponent', () => {
  let component: HospitalComplaintsComponent;
  let fixture: ComponentFixture<HospitalComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalComplaintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
