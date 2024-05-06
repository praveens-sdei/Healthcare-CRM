import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpriceComponent } from './newprice.component';

describe('NewpriceComponent', () => {
  let component: NewpriceComponent;
  let fixture: ComponentFixture<NewpriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewpriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
