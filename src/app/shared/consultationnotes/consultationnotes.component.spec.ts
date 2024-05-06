import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationnotesComponent } from './consultationnotes.component';

describe('ConsultationnotesComponent', () => {
  let component: ConsultationnotesComponent;
  let fixture: ComponentFixture<ConsultationnotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationnotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationnotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
