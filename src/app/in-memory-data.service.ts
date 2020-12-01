import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Timetable } from './timetable';
import { UniversityClass } from './university-class';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(): {} {
    const timetable: Timetable[] = [
      {id: 1, startDate: '17-11-2020', endDate: '17-12-2020', name: 'Semestr VII'}
    ];

    const universityClasses: UniversityClass[] = [
      {id: 1, startTime: '10:00', endTime: '12:15', name: 'Matematyka Dyskretna', classroom: 'E301', dayOfWeek: 1, color: 'blue'},
    ];

    return {timetable, universityClasses};
  }

  genId<T extends Timetable | UniversityClass>(myTable: T[]): number {
    return myTable.length > 0 ? Math.max(...myTable.map(t => t.id)) + 1 : 11;
  }
}
