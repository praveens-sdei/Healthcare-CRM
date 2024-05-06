import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClaimContentComponent } from './manage-claim-content.component';

describe('ManageClaimContentComponent', () => {
  let component: ManageClaimContentComponent;
  let fixture: ComponentFixture<ManageClaimContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClaimContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClaimContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
