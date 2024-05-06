import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalLabImagingComponent } from './educational-lab-imaging.component';

describe('EducationalLabImagingComponent', () => {
  let component: EducationalLabImagingComponent;
  let fixture: ComponentFixture<EducationalLabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalLabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalLabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
