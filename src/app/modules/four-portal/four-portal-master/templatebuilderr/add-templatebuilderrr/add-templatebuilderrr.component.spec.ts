import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemplatebuilderrrComponent } from './add-templatebuilderrr.component';

describe('AddTemplatebuilderrrComponent', () => {
  let component: AddTemplatebuilderrrComponent;
  let fixture: ComponentFixture<AddTemplatebuilderrrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTemplatebuilderrrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTemplatebuilderrrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
