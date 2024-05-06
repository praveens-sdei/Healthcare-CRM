import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSharedPatientComponent } from './address-shared-patient.component';

describe('AddressSharedPatientComponent', () => {
  let component: AddressSharedPatientComponent;
  let fixture: ComponentFixture<AddressSharedPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressSharedPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSharedPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
