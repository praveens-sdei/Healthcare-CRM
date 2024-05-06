import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizationclaimsviewComponent } from './hospitalizationclaimsview.component';

describe('HospitalizationclaimsviewComponent', () => {
  let component: HospitalizationclaimsviewComponent;
  let fixture: ComponentFixture<HospitalizationclaimsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalizationclaimsviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalizationclaimsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
