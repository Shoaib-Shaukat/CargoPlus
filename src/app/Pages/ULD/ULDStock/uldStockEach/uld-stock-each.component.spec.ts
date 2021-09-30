import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UldStockEachComponent } from './uld-stock-each.component';

describe('UldStockEachComponent', () => {
  let component: UldStockEachComponent;
  let fixture: ComponentFixture<UldStockEachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UldStockEachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UldStockEachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
