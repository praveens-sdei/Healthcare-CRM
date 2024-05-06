import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizationCommoninformationComponent } from './hospitalization-commoninformation.component';

describe('HospitalizationCommoninformationComponent', () => {
  let component: HospitalizationCommoninformationComponent;
  let fixture: ComponentFixture<HospitalizationCommoninformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalizationCommoninformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalizationCommoninformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
