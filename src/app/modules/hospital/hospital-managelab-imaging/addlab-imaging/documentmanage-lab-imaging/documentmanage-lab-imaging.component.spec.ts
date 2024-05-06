import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentmanageLabImagingComponent } from './documentmanage-lab-imaging.component';

describe('DocumentmanageLabImagingComponent', () => {
  let component: DocumentmanageLabImagingComponent;
  let fixture: ComponentFixture<DocumentmanageLabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentmanageLabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentmanageLabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
