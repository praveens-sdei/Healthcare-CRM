import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpricerequestComponent } from './newpricerequest.component';

describe('NewpricerequestComponent', () => {
  let component: NewpricerequestComponent;
  let fixture: ComponentFixture<NewpricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewpricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
