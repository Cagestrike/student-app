import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUniversityClassDialogComponent } from './new-university-class-dialog.component';

describe('NewUniversityClassDialogComponent', () => {
  let component: NewUniversityClassDialogComponent;
  let fixture: ComponentFixture<NewUniversityClassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewUniversityClassDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUniversityClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
