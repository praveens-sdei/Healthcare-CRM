import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyandconditionComponent } from './privacyandcondition.component';

describe('PrivacyandconditionComponent', () => {
  let component: PrivacyandconditionComponent;
  let fixture: ComponentFixture<PrivacyandconditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyandconditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyandconditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
