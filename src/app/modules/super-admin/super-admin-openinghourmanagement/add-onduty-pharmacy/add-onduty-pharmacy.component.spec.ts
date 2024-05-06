import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOndutyPharmacyComponent } from './add-onduty-pharmacy.component';

describe('AddOndutyPharmacyComponent', () => {
  let component: AddOndutyPharmacyComponent;
  let fixture: ComponentFixture<AddOndutyPharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOndutyPharmacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOndutyPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
