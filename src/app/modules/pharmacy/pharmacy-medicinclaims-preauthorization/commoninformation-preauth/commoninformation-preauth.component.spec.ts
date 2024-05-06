import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationPreauthComponent } from './commoninformation-preauth.component';

describe('CommoninformationPreauthComponent', () => {
  let component: CommoninformationPreauthComponent;
  let fixture: ComponentFixture<CommoninformationPreauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationPreauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationPreauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
