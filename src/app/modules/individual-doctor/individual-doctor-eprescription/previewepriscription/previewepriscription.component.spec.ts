import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewepriscriptionComponent } from './previewepriscription.component';

describe('PreviewepriscriptionComponent', () => {
  let component: PreviewepriscriptionComponent;
  let fixture: ComponentFixture<PreviewepriscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewepriscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewepriscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
