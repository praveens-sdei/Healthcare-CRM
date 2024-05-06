import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancepermissionComponent } from './insurancepermission.component';

describe('InsurancepermissionComponent', () => {
  let component: InsurancepermissionComponent;
  let fixture: ComponentFixture<InsurancepermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancepermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancepermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
