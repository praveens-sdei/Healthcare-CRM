import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyComplaintsComponent } from './pharmacy-complaints.component';

describe('PharmacyComplaintsComponent', () => {
  let component: PharmacyComplaintsComponent;
  let fixture: ComponentFixture<PharmacyComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyComplaintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
