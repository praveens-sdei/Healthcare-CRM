import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminManualmedicineclaimlistComponent } from './super-admin-manualmedicineclaimlist.component';

describe('SuperAdminManualmedicineclaimlistComponent', () => {
  let component: SuperAdminManualmedicineclaimlistComponent;
  let fixture: ComponentFixture<SuperAdminManualmedicineclaimlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminManualmedicineclaimlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminManualmedicineclaimlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
