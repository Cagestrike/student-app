import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCalendarEventDialogComponent } from './new-calendar-event-dialog.component';

describe('NewCalendarEventDialogComponent', () => {
  let component: NewCalendarEventDialogComponent;
  let fixture: ComponentFixture<NewCalendarEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCalendarEventDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCalendarEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
