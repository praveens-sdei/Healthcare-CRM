import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedbasicinfoComponent } from './approvedbasicinfo.component';

describe('ApprovedbasicinfoComponent', () => {
  let component: ApprovedbasicinfoComponent;
  let fixture: ComponentFixture<ApprovedbasicinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedbasicinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedbasicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
