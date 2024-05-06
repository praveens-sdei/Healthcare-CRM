import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManualmedicinClaimComponent } from './view-manualmedicin-claim.component';

describe('ViewManualmedicinClaimComponent', () => {
  let component: ViewManualmedicinClaimComponent;
  let fixture: ComponentFixture<ViewManualmedicinClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewManualmedicinClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManualmedicinClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
