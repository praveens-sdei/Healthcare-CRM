import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCreateprofileComponent } from './insurance-createprofile.component';

describe('InsuranceCreateprofileComponent', () => {
  let component: InsuranceCreateprofileComponent;
  let fixture: ComponentFixture<InsuranceCreateprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCreateprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCreateprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
