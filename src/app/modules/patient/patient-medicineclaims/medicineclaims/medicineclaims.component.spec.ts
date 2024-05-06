import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineclaimsComponent } from './medicineclaims.component';

describe('MedicineclaimsComponent', () => {
  let component: MedicineclaimsComponent;
  let fixture: ComponentFixture<MedicineclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
