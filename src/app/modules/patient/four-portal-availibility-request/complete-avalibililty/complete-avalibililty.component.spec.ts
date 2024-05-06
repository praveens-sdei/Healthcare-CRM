import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteAvalibililtyComponent } from './complete-avalibililty.component';

describe('CompleteAvalibililtyComponent', () => {
  let component: CompleteAvalibililtyComponent;
  let fixture: ComponentFixture<CompleteAvalibililtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteAvalibililtyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteAvalibililtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
