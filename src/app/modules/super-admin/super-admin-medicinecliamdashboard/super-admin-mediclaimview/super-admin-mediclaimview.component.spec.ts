import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminMediclaimviewComponent } from './super-admin-mediclaimview.component';

describe('SuperAdminMediclaimviewComponent', () => {
  let component: SuperAdminMediclaimviewComponent;
  let fixture: ComponentFixture<SuperAdminMediclaimviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminMediclaimviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminMediclaimviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
