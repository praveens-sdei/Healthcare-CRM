import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopitalizationclaimViewComponent } from './hopitalizationclaim-view.component';

describe('HopitalizationclaimViewComponent', () => {
  let component: HopitalizationclaimViewComponent;
  let fixture: ComponentFixture<HopitalizationclaimViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HopitalizationclaimViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HopitalizationclaimViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
