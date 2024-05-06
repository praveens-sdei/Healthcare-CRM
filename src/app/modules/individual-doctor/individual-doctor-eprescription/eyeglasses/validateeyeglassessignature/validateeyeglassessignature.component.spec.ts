import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateeyeglassessignatureComponent } from './validateeyeglassessignature.component';

describe('ValidateeyeglassessignatureComponent', () => {
  let component: ValidateeyeglassessignatureComponent;
  let fixture: ComponentFixture<ValidateeyeglassessignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateeyeglassessignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateeyeglassessignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
