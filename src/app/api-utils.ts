import { HttpHeaders } from '@angular/common/http';

export const BASE_API_URL: string = 'https://studenthelperappapi.herokuapp.com/api';

export function formatDateToAPIFormat(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function formatDatetimeToAPIFormat(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}