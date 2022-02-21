import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSEApprovalComponent } from './gseapproval.component';

describe('GSEApprovalComponent', () => {
  let component: GSEApprovalComponent;
  let fixture: ComponentFixture<GSEApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GSEApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GSEApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
