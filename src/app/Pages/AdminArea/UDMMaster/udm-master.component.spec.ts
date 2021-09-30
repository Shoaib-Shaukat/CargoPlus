import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdmMasterComponent } from './udm-master.component';

describe('UdmMasterComponent', () => {
  let component: UdmMasterComponent;
  let fixture: ComponentFixture<UdmMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdmMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UdmMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
