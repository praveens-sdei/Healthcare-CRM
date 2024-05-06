import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRoleComponent } from './claim-role.component';

describe('ClaimRoleComponent', () => {
  let component: ClaimRoleComponent;
  let fixture: ComponentFixture<ClaimRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
