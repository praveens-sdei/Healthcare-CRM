import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoleTypeComponent } from './assign-role-type.component';

describe('AssignRoleTypeComponent', () => {
  let component: AssignRoleTypeComponent;
  let fixture: ComponentFixture<AssignRoleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRoleTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRoleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
