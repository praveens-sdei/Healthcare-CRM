import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalOpticalComponent } from './educational-optical.component';

describe('EducationalOpticalComponent', () => {
  let component: EducationalOpticalComponent;
  let fixture: ComponentFixture<EducationalOpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalOpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalOpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
