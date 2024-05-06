import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeglassPrescripeComponent } from './eyeglass-prescripe.component';

describe('EyeglassPrescripeComponent', () => {
  let component: EyeglassPrescripeComponent;
  let fixture: ComponentFixture<EyeglassPrescripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeglassPrescripeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeglassPrescripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
