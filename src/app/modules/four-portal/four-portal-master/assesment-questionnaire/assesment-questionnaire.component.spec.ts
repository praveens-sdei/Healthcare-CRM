import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentQuestionnaireComponent } from './assesment-questionnaire.component';

describe('AssesmentQuestionnaireComponent', () => {
  let component: AssesmentQuestionnaireComponent;
  let fixture: ComponentFixture<AssesmentQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssesmentQuestionnaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssesmentQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
