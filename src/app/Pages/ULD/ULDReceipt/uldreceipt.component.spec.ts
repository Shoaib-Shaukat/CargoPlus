import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ULDReceiptComponent } from './uldreceipt.component';

describe('ULDReceiptComponent', () => {
  let component: ULDReceiptComponent;
  let fixture: ComponentFixture<ULDReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ULDReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ULDReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
