import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Timetable } from './timetable';
import { UniversityClass } from './university-class';
import { Event } from './event';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(): {} {
    const timetable: Timetable[] = [
      {id: 1, startDate: '17-11-2020', endDate: '17-12-2021', name: 'Semestr VII'}
    ];

    const universityClasses: UniversityClass[] = [
      {id: 1, startTime: '10:00', endTime: '12:15', name: 'Matematyka Dyskretna', classroom: 'E301', dayOfWeek: 1, color: '#3498DB'},
    ];

    const todayDate = new Date();
    const tomorrow = todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + (todayDate.getDate() + 1);

    const events: Event[] = [
        {id: 1, name: 'Jakieś kolokwium', startDatetime: new Date(tomorrow + ' 10:00'), endDatetime: new Date(tomorrow + ' 13:00'), allDayEvent: false, description: 'kolokwium z czegos tam', location: 'politechnika lubelska'},
        {id: 2, name: 'All Day Test Event', startDatetime: new Date(), endDatetime: new Date(), allDayEvent: true}
    ];

    return {timetable, universityClasses, events};
  }

  genId<T extends Timetable | UniversityClass | Event>(myTable: T[]): number {
    return myTable.length > 0 ? Math.max(...myTable.map(t => t.id)) + 1 : 11;
  }
}
