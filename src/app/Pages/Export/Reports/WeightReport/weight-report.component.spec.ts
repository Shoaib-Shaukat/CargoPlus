import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightReportComponent } from './weight-report.component';

describe('WeightReportComponent', () => {
  let component: WeightReportComponent;
  let fixture: ComponentFixture<WeightReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
