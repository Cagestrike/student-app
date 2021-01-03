import { HttpHeaders } from '@angular/common/http';
import { UniversityClass } from './university-class';
import { UniversityClassDate } from './university-class-date';
import { UniversityClassWithDates } from './university-class-with-dates';
import { UserEvent } from './user-event';
import { UserEventDate } from './user-event-date';
import { UserEventWithDates } from './user-event-with-dates';

export const BASE_API_URL = 'https://studenthelperappapi.herokuapp.com/api';

export function formatDateToAPIFormat(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export function formatDatetimeToAPIFormat(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function getTimeFromDatetime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export function parseActivitiesToUniversityClassesWithDates(universityClasses): UniversityClassWithDates[] {
    const universityClassWithDates: UniversityClassWithDates[] = [];

    universityClasses.forEach(uniClass => {
        const uniClassIndex = universityClassWithDates.findIndex(uc => uc.universityClass.id === uniClass.id);

        if (uniClassIndex === -1) {
            const universityClassToAdd = {
                id: uniClass.id,
                name: uniClass.name,
                place: uniClass.place,
                colour: uniClass.colour,
                description: uniClass.description,
                category: uniClass.category
            } as UniversityClass;

            const dateToAdd = {
                id: uniClass['activity_dates.id'],
                start_date: uniClass.start_date,
                end_date: uniClass.end_date,
                periodicity: uniClass.periodicity,
                periodicityDateId: uniClass.periodicityDatesId
            } as UniversityClassDate;

            const universityClassWithDatesToAdd = {
                universityClass: universityClassToAdd,
                dates: new Map()
            } as UniversityClassWithDates;

            if (uniClass['activity_dates.id']) {
                // universityClassWithDatesToAdd.dates = [dateToAdd];
                universityClassWithDatesToAdd.dates = new Map().set(uniClass.periodicityDatesId, [dateToAdd]);
            }

            universityClassWithDates.push(universityClassWithDatesToAdd);
        } else {
            const dateToAdd = {
                id: uniClass['activity_dates.id'],
                start_date: uniClass.start_date,
                end_date: uniClass.end_date,
                periodicity: uniClass.periodicity,
                periodicityDateId: uniClass.periodicityDatesId
            } as UniversityClassDate;

            if (!universityClassWithDates[uniClassIndex].dates.has(uniClass.periodicityDatesId)) {
                universityClassWithDates[uniClassIndex].dates.set(uniClass.periodicityDatesId, []);
            }
            universityClassWithDates[uniClassIndex].dates.get(uniClass.periodicityDatesId).push(dateToAdd);
            // if(periodicityDateIndex === -1) {
            // universityClassWithDates[uniClassIndex].dates.values.push({
            //     id: uniClass['activity_dates.id'],
            //     start_date: uniClass.start_date,
            //     end_date: uniClass.end_date,
            //     periodicityDateId: uniClass.periodicityDatesId
            // } as UniversityClassDate);
            // } else {

            // }
        }
    });
    return universityClassWithDates;
}

export function parseEventsToUserEventsWithDates(events): UserEventWithDates[] {
    const userEventsWithDates: UserEventWithDates[] = [];

    events.forEach(event => {
        const eventIndex = userEventsWithDates.findIndex(ev => ev.userEvent.id === event.id);

        if(eventIndex === -1) {
            const userEventToAdd = {
                id: event.id,
                name: event.name,
                place: event.place,
                category: event.category,
                colour: event.colour,
                description: event.description
            } as UserEvent;

            const eventDateToAdd = {
                id: event['event_date.id'],
                allDay_flag: event.allDay_flag,
                start_date: event.start_date,
                end_date: event.end_date,
            } as UserEventDate;

            const userEventWithDateToAdd = {
                userEvent: userEventToAdd,
                dates: [],
            } as UserEventWithDates;

            if(event['event_date.id']) {
                userEventWithDateToAdd.dates = [eventDateToAdd]
            }

            userEventsWithDates.push(userEventWithDateToAdd);
        } else {
            const eventDateToAdd = {
                id: event['event_date.id'],
                allDay_flag: event.allDay_flag,
                start_date: event.start_date,
                end_date: event.end_date,
            } as UserEventDate;

            userEventsWithDates[eventIndex].dates.push(eventDateToAdd);
        }
    });

    return userEventsWithDates;
}