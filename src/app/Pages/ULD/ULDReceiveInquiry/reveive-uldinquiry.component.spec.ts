import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReveiveULDInquiryComponent } from './reveive-uldinquiry.component';

describe('ReveiveULDInquiryComponent', () => {
  let component: ReveiveULDInquiryComponent;
  let fixture: ComponentFixture<ReveiveULDInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReveiveULDInquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReveiveULDInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
