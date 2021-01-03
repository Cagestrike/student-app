import { UserEvent } from './user-event';
import { UserEventDate } from './user-event-date';

export interface UserEventWithDates {
    userEvent: UserEvent;
    dates: UserEventDate[];
}