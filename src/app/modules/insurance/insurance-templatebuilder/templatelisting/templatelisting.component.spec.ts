import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatelistingComponent } from './templatelisting.component';

describe('TemplatelistingComponent', () => {
  let component: TemplatelistingComponent;
  let fixture: ComponentFixture<TemplatelistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatelistingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatelistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
