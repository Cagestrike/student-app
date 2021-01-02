import { UniversityClass } from './university-class';
import { UniversityClassDate } from './university-class-date';

export interface UniversityClassWithDates {
    universityClass: UniversityClass;
    dates: Map<number, UniversityClassDate[]>;
}