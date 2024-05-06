import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptionaddlabtestComponent } from './eprescriptionaddlabtest.component';

describe('EprescriptionaddlabtestComponent', () => {
  let component: EprescriptionaddlabtestComponent;
  let fixture: ComponentFixture<EprescriptionaddlabtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptionaddlabtestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptionaddlabtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
