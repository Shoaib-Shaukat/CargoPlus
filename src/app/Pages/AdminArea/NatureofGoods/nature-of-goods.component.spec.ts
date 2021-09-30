import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureOfGoodsComponent } from './nature-of-goods.component';

describe('NatureOfGoodsComponent', () => {
  let component: NatureOfGoodsComponent;
  let fixture: ComponentFixture<NatureOfGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NatureOfGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureOfGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
