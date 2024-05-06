import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentmanageParamedicalComponent } from './documentmanage-paramedical.component';

describe('DocumentmanageParamedicalComponent', () => {
  let component: DocumentmanageParamedicalComponent;
  let fixture: ComponentFixture<DocumentmanageParamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentmanageParamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentmanageParamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
