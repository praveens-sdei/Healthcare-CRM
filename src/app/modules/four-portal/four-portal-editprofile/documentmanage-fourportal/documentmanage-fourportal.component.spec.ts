import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentmanageFourportalComponent } from './documentmanage-fourportal.component';

describe('DocumentmanageFourportalComponent', () => {
  let component: DocumentmanageFourportalComponent;
  let fixture: ComponentFixture<DocumentmanageFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentmanageFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentmanageFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
