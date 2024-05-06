import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctortohospitalComponent } from './doctortohospital.component';

describe('DoctortohospitalComponent', () => {
  let component: DoctortohospitalComponent;
  let fixture: ComponentFixture<DoctortohospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctortohospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctortohospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
