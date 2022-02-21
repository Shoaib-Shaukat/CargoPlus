import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaildataComponent } from './emaildata.component';

describe('EmaildataComponent', () => {
  let component: EmaildataComponent;
  let fixture: ComponentFixture<EmaildataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmaildataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaildataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
