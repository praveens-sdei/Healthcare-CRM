import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamedicalprofileComponent } from './paramedicalprofile.component';

describe('ParamedicalprofileComponent', () => {
  let component: ParamedicalprofileComponent;
  let fixture: ComponentFixture<ParamedicalprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamedicalprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamedicalprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
