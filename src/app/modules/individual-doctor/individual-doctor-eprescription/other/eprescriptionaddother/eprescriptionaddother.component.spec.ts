import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptionaddotherComponent } from './eprescriptionaddother.component';

describe('EprescriptionaddotherComponent', () => {
  let component: EprescriptionaddotherComponent;
  let fixture: ComponentFixture<EprescriptionaddotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptionaddotherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptionaddotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
