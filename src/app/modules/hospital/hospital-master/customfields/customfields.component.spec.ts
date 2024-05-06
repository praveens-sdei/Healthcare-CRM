import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomfieldsComponent } from './customfields.component';

describe('CustomfieldsComponent', () => {
  let component: CustomfieldsComponent;
  let fixture: ComponentFixture<CustomfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomfieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
