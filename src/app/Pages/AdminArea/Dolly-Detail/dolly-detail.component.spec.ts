import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DollyDetailComponent } from './dolly-detail.component';

describe('DollyDetailComponent', () => {
  let component: DollyDetailComponent;
  let fixture: ComponentFixture<DollyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DollyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DollyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
