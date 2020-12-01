import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTimetableComponent } from './current-timetable.component';

describe('CurrentTimetableComponent', () => {
  let component: CurrentTimetableComponent;
  let fixture: ComponentFixture<CurrentTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentTimetableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
