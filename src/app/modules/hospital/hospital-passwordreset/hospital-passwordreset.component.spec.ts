import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPasswordresetComponent } from './hospital-passwordreset.component';

describe('HospitalPasswordresetComponent', () => {
  let component: HospitalPasswordresetComponent;
  let fixture: ComponentFixture<HospitalPasswordresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPasswordresetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
