import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatebuilderrComponent } from './templatebuilderr.component';

describe('TemplatebuilderrComponent', () => {
  let component: TemplatebuilderrComponent;
  let fixture: ComponentFixture<TemplatebuilderrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatebuilderrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatebuilderrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
