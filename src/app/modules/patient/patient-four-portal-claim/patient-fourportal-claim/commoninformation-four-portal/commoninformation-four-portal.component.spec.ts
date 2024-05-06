import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationFourPortalComponent } from './commoninformation-four-portal.component';

describe('CommoninformationFourPortalComponent', () => {
  let component: CommoninformationFourPortalComponent;
  let fixture: ComponentFixture<CommoninformationFourPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationFourPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationFourPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
