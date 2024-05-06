import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatelabsignatureComponent } from './validatelabsignature.component';

describe('ValidatelabsignatureComponent', () => {
  let component: ValidatelabsignatureComponent;
  let fixture: ComponentFixture<ValidatelabsignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatelabsignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatelabsignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
