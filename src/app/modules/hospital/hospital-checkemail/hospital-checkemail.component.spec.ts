import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalCheckemailComponent } from './hospital-checkemail.component';

describe('HospitalCheckemailComponent', () => {
  let component: HospitalCheckemailComponent;
  let fixture: ComponentFixture<HospitalCheckemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalCheckemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalCheckemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
