import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPrescriptionValidateComponent } from './e-prescription-validate.component';

describe('EPrescriptionValidateComponent', () => {
  let component: EPrescriptionValidateComponent;
  let fixture: ComponentFixture<EPrescriptionValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPrescriptionValidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPrescriptionValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
