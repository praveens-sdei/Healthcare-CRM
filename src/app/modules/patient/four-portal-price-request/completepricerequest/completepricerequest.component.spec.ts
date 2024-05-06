import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletepricerequestComponent } from './completepricerequest.component';

describe('CompletepricerequestComponent', () => {
  let component: CompletepricerequestComponent;
  let fixture: ComponentFixture<CompletepricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletepricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletepricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
