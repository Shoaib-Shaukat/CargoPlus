import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UldStockAllComponent } from './uld-stock-all.component';

describe('UldStockAllComponent', () => {
  let component: UldStockAllComponent;
  let fixture: ComponentFixture<UldStockAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UldStockAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UldStockAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
