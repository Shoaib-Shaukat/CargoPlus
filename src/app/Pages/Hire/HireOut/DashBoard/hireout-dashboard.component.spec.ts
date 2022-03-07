import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireoutDashboardComponent } from './hireout-dashboard.component';

describe('HireoutDashboardComponent', () => {
  let component: HireoutDashboardComponent;
  let fixture: ComponentFixture<HireoutDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HireoutDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HireoutDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
