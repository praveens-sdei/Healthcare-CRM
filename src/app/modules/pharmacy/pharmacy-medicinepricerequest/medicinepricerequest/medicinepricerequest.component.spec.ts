import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinepricerequestComponent } from './medicinepricerequest.component';

describe('MedicinepricerequestComponent', () => {
  let component: MedicinepricerequestComponent;
  let fixture: ComponentFixture<MedicinepricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicinepricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicinepricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
