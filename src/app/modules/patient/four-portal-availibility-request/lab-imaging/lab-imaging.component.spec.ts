import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabImagingComponent } from './lab-imaging.component';

describe('LabImagingComponent', () => {
  let component: LabImagingComponent;
  let fixture: ComponentFixture<LabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
