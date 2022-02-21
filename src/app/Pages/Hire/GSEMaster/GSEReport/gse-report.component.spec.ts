import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GseReportComponent } from './gse-report.component';

describe('GseReportComponent', () => {
  let component: GseReportComponent;
  let fixture: ComponentFixture<GseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
