import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalpermissionComponent } from './dentalpermission.component';

describe('DentalpermissionComponent', () => {
  let component: DentalpermissionComponent;
  let fixture: ComponentFixture<DentalpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalpermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
