import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalParamedicalComponent } from './educational-paramedical.component';

describe('EducationalParamedicalComponent', () => {
  let component: EducationalParamedicalComponent;
  let fixture: ComponentFixture<EducationalParamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalParamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalParamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
