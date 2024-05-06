import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyMedicinepricerequestComponent } from './pharmacy-medicinepricerequest.component';

describe('PharmacyMedicinepricerequestComponent', () => {
  let component: PharmacyMedicinepricerequestComponent;
  let fixture: ComponentFixture<PharmacyMedicinepricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyMedicinepricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyMedicinepricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
