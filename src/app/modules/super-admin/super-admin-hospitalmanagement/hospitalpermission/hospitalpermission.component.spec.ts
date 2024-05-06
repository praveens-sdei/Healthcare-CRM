import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalpermissionComponent } from './hospitalpermission.component';

describe('HospitalpermissionComponent', () => {
  let component: HospitalpermissionComponent;
  let fixture: ComponentFixture<HospitalpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalpermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
