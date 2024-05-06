import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedpermissionComponent } from './assignedpermission.component';

describe('AssignedpermissionComponent', () => {
  let component: AssignedpermissionComponent;
  let fixture: ComponentFixture<AssignedpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedpermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
