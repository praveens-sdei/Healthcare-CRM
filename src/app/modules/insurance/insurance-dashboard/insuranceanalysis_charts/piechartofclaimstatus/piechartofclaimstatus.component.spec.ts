import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartofclaimstatusComponent } from './piechartofclaimstatus.component';

describe('PiechartofclaimstatusComponent', () => {
  let component: PiechartofclaimstatusComponent;
  let fixture: ComponentFixture<PiechartofclaimstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiechartofclaimstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiechartofclaimstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
