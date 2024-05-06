import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationconsultationComponent } from './commoninformationconsultation.component';

describe('CommoninformationconsultationComponent', () => {
  let component: CommoninformationconsultationComponent;
  let fixture: ComponentFixture<CommoninformationconsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationconsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationconsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
