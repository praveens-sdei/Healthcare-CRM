import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeFourPortalComponent } from './servicetype-four-portal.component';

describe('ServicetypeFourPortalComponent', () => {
  let component: ServicetypeFourPortalComponent;
  let fixture: ComponentFixture<ServicetypeFourPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeFourPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeFourPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
