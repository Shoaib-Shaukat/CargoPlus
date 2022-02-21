import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceReportComponent } from './acceptance-report.component';

describe('AcceptanceReportComponent', () => {
  let component: AcceptanceReportComponent;
  let fixture: ComponentFixture<AcceptanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
