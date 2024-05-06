import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalEditprofileComponent } from './four-portal-editprofile.component';

describe('FourPortalEditprofileComponent', () => {
  let component: FourPortalEditprofileComponent;
  let fixture: ComponentFixture<FourPortalEditprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalEditprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalEditprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
