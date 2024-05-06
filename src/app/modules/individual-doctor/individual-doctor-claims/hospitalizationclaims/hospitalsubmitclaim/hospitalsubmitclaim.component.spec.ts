import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalsubmitclaimComponent } from './hospitalsubmitclaim.component';

describe('HospitalsubmitclaimComponent', () => {
  let component: HospitalsubmitclaimComponent;
  let fixture: ComponentFixture<HospitalsubmitclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalsubmitclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalsubmitclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
