import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalManagedentalComponent } from './hospital-managedental.component';

describe('HospitalManagedentalComponent', () => {
  let component: HospitalManagedentalComponent;
  let fixture: ComponentFixture<HospitalManagedentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalManagedentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalManagedentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
