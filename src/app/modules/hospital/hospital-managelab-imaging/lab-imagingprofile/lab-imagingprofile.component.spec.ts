import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabImagingprofileComponent } from './lab-imagingprofile.component';

describe('LabImagingprofileComponent', () => {
  let component: LabImagingprofileComponent;
  let fixture: ComponentFixture<LabImagingprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabImagingprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabImagingprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
