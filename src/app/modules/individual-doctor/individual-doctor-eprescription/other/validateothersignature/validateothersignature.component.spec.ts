import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateothersignatureComponent } from './validateothersignature.component';

describe('ValidateothersignatureComponent', () => {
  let component: ValidateothersignatureComponent;
  let fixture: ComponentFixture<ValidateothersignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateothersignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateothersignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
