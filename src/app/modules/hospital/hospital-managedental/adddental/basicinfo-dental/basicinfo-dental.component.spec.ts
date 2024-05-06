import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicinfoDentalComponent } from './basicinfo-dental.component';

describe('BasicinfoDentalComponent', () => {
  let component: BasicinfoDentalComponent;
  let fixture: ComponentFixture<BasicinfoDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicinfoDentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicinfoDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
