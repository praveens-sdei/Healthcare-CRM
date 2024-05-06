import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminAssociationgroupComponent } from './super-admin-associationgroup.component';

describe('SuperAdminAssociationgroupComponent', () => {
  let component: SuperAdminAssociationgroupComponent;
  let fixture: ComponentFixture<SuperAdminAssociationgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminAssociationgroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminAssociationgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
