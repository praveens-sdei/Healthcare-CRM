import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthplanviewComponent } from './healthplanview.component';

describe('HealthplanviewComponent', () => {
  let component: HealthplanviewComponent;
  let fixture: ComponentFixture<HealthplanviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthplanviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthplanviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
