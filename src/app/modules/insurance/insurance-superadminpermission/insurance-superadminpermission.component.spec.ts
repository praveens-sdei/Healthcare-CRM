import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSuperadminpermissionComponent } from './insurance-superadminpermission.component';

describe('InsuranceSuperadminpermissionComponent', () => {
  let component: InsuranceSuperadminpermissionComponent;
  let fixture: ComponentFixture<InsuranceSuperadminpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceSuperadminpermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceSuperadminpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
