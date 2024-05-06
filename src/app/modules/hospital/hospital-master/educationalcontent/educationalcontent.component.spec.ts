import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalcontentComponent } from './educationalcontent.component';

describe('EducationalcontentComponent', () => {
  let component: EducationalcontentComponent;
  let fixture: ComponentFixture<EducationalcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalcontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
