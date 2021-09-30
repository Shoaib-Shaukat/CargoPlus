import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AWBDetailComponent } from './awbdetail.component';

describe('AWBDetailComponent', () => {
  let component: AWBDetailComponent;
  let fixture: ComponentFixture<AWBDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AWBDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AWBDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
