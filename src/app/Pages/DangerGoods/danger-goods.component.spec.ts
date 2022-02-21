import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangerGoodsComponent } from './danger-goods.component';

describe('DangerGoodsComponent', () => {
  let component: DangerGoodsComponent;
  let fixture: ComponentFixture<DangerGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DangerGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DangerGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
