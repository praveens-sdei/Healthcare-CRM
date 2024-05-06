import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatevaccinationsignatureComponent } from './validatevaccinationsignature.component';

describe('ValidatevaccinationsignatureComponent', () => {
  let component: ValidatevaccinationsignatureComponent;
  let fixture: ComponentFixture<ValidatevaccinationsignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatevaccinationsignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatevaccinationsignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
