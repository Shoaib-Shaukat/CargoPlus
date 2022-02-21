import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMasterComponent } from './add-edit-master.component';

describe('AddEditMasterComponent', () => {
  let component: AddEditMasterComponent;
  let fixture: ComponentFixture<AddEditMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
