import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyPasswordresetComponent } from './pharmacy-passwordreset.component';

describe('PharmacyPasswordresetComponent', () => {
  let component: PharmacyPasswordresetComponent;
  let fixture: ComponentFixture<PharmacyPasswordresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyPasswordresetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyPasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
