import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyMedicinecliamdashboardComponent } from './pharmacy-medicinecliamdashboard.component';

describe('PharmacyMedicinecliamdashboardComponent', () => {
  let component: PharmacyMedicinecliamdashboardComponent;
  let fixture: ComponentFixture<PharmacyMedicinecliamdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyMedicinecliamdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyMedicinecliamdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
