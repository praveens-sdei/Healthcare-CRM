import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyCheckemailComponent } from './pharmacy-checkemail.component';

describe('PharmacyCheckemailComponent', () => {
  let component: PharmacyCheckemailComponent;
  let fixture: ComponentFixture<PharmacyCheckemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyCheckemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyCheckemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
