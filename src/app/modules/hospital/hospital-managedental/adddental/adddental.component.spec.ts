import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddentalComponent } from './adddental.component';

describe('AdddentalComponent', () => {
  let component: AdddentalComponent;
  let fixture: ComponentFixture<AdddentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
