import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailibilityAllListComponent } from './availibility-all-list.component';

describe('AvailibilityAllListComponent', () => {
  let component: AvailibilityAllListComponent;
  let fixture: ComponentFixture<AvailibilityAllListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailibilityAllListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailibilityAllListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
