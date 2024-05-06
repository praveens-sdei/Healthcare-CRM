import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateimagingsignatureComponent } from './validateimagingsignature.component';

describe('ValidateimagingsignatureComponent', () => {
  let component: ValidateimagingsignatureComponent;
  let fixture: ComponentFixture<ValidateimagingsignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateimagingsignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateimagingsignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
