import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusanalysisComponent } from './statusanalysis.component';

describe('StatusanalysisComponent', () => {
  let component: StatusanalysisComponent;
  let fixture: ComponentFixture<StatusanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusanalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
