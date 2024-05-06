import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeglassesComponent } from './eyeglasses.component';

describe('EyeglassesComponent', () => {
  let component: EyeglassesComponent;
  let fixture: ComponentFixture<EyeglassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeglassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeglassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
