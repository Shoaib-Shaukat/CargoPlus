import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GseMasterComponent } from './gse-master.component';

describe('GseMasterComponent', () => {
  let component: GseMasterComponent;
  let fixture: ComponentFixture<GseMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GseMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
