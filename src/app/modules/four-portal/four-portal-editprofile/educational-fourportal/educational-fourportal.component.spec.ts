import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalFourportalComponent } from './educational-fourportal.component';

describe('EducationalFourportalComponent', () => {
  let component: EducationalFourportalComponent;
  let fixture: ComponentFixture<EducationalFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
