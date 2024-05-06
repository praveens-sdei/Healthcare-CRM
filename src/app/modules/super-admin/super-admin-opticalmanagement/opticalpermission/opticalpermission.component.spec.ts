import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpticalpermissionComponent } from './opticalpermission.component';

describe('OpticalpermissionComponent', () => {
  let component: OpticalpermissionComponent;
  let fixture: ComponentFixture<OpticalpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpticalpermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpticalpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
