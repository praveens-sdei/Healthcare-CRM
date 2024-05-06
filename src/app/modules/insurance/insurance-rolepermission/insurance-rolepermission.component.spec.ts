import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceRolepermissionComponent } from './insurance-rolepermission.component';

describe('InsuranceRolepermissionComponent', () => {
  let component: InsuranceRolepermissionComponent;
  let fixture: ComponentFixture<InsuranceRolepermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceRolepermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceRolepermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
