import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalCompliantmanagementComponent } from './four-portal-compliantmanagement.component';

describe('FourPortalCompliantmanagementComponent', () => {
  let component: FourPortalCompliantmanagementComponent;
  let fixture: ComponentFixture<FourPortalCompliantmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalCompliantmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalCompliantmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
