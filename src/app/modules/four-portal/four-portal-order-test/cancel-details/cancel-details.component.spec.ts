import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelDetailsComponent } from './cancel-details.component';

describe('CancelDetailsComponent', () => {
  let component: CancelDetailsComponent;
  let fixture: ComponentFixture<CancelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
