import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediclaimdetailComponent } from './mediclaimdetail.component';

describe('MediclaimdetailComponent', () => {
  let component: MediclaimdetailComponent;
  let fixture: ComponentFixture<MediclaimdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediclaimdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediclaimdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
