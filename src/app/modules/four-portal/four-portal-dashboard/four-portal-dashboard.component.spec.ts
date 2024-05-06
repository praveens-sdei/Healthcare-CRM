import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalDashboardComponent } from './four-portal-dashboard.component';

describe('FourPortalDashboardComponent', () => {
  let component: FourPortalDashboardComponent;
  let fixture: ComponentFixture<FourPortalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
