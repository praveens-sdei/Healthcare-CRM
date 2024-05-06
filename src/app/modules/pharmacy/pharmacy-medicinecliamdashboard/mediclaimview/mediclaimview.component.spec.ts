import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediclaimviewComponent } from './mediclaimview.component';

describe('MediclaimviewComponent', () => {
  let component: MediclaimviewComponent;
  let fixture: ComponentFixture<MediclaimviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediclaimviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediclaimviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
