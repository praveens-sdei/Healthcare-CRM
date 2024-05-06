import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddopticalComponent } from './addoptical.component';

describe('AddopticalComponent', () => {
  let component: AddopticalComponent;
  let fixture: ComponentFixture<AddopticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddopticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddopticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
