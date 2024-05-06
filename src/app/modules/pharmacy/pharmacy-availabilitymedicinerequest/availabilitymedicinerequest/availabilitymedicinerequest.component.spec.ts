import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilitymedicinerequestComponent } from './availabilitymedicinerequest.component';

describe('AvailabilitymedicinerequestComponent', () => {
  let component: AvailabilitymedicinerequestComponent;
  let fixture: ComponentFixture<AvailabilitymedicinerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilitymedicinerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilitymedicinerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
