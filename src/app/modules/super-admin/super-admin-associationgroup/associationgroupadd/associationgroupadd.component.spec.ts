import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationgroupaddComponent } from './associationgroupadd.component';

describe('AssociationgroupaddComponent', () => {
  let component: AssociationgroupaddComponent;
  let fixture: ComponentFixture<AssociationgroupaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationgroupaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationgroupaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
