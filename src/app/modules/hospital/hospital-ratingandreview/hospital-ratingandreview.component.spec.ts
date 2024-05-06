import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalRatingandreviewComponent } from './hospital-ratingandreview.component';

describe('HospitalRatingandreviewComponent', () => {
  let component: HospitalRatingandreviewComponent;
  let fixture: ComponentFixture<HospitalRatingandreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalRatingandreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRatingandreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
