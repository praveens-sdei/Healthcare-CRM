import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAvailabilitymedicinerequestComponent } from './pharmacy-availabilitymedicinerequest.component';

describe('PharmacyAvailabilitymedicinerequestComponent', () => {
  let component: PharmacyAvailabilitymedicinerequestComponent;
  let fixture: ComponentFixture<PharmacyAvailabilitymedicinerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyAvailabilitymedicinerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyAvailabilitymedicinerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
