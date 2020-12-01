export interface DayOfWeek {
    value: number;
    viewValue: string;
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
    {value: 0, viewValue: 'Niedziela'},
    {value: 1, viewValue: 'Poniedziałek'},
    {value: 2, viewValue: 'Wtorek'},
    {value: 3, viewValue: 'Środa'},
    {value: 4, viewValue: 'Czwartek'},
    {value: 5, viewValue: 'Piątek'},
    {value: 6, viewValue: 'Sobota'},
];

export function getDayOfWeekByValue(val): string {
    return DAYS_OF_WEEK.find(dayOfWeek => dayOfWeek.value === val).viewValue;
}