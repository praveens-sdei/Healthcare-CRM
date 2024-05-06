import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptionotherComponent } from './eprescriptionother.component';

describe('EprescriptionotherComponent', () => {
  let component: EprescriptionotherComponent;
  let fixture: ComponentFixture<EprescriptionotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptionotherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptionotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
