import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentmanageOpticalComponent } from './documentmanage-optical.component';

describe('DocumentmanageOpticalComponent', () => {
  let component: DocumentmanageOpticalComponent;
  let fixture: ComponentFixture<DocumentmanageOpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentmanageOpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentmanageOpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
