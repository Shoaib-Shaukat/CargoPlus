import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GseCatComponent } from './gse-cat.component';

describe('GseCatComponent', () => {
  let component: GseCatComponent;
  let fixture: ComponentFixture<GseCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GseCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GseCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
