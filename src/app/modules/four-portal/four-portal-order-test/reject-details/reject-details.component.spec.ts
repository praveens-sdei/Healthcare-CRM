import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectDetailsComponent } from './reject-details.component';

describe('RejectDetailsComponent', () => {
  let component: RejectDetailsComponent;
  let fixture: ComponentFixture<RejectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
