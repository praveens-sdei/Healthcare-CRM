import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizationServicetypeComponent } from './hospitalization-servicetype.component';

describe('HospitalizationServicetypeComponent', () => {
  let component: HospitalizationServicetypeComponent;
  let fixture: ComponentFixture<HospitalizationServicetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalizationServicetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalizationServicetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
