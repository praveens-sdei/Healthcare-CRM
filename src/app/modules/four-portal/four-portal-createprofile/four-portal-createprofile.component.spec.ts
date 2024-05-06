import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalCreateprofileComponent } from './four-portal-createprofile.component';

describe('FourPortalCreateprofileComponent', () => {
  let component: FourPortalCreateprofileComponent;
  let fixture: ComponentFixture<FourPortalCreateprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalCreateprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalCreateprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
