import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalDentalComponent } from './educational-dental.component';

describe('EducationalDentalComponent', () => {
  let component: EducationalDentalComponent;
  let fixture: ComponentFixture<EducationalDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalDentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
