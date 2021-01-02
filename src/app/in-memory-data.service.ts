import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Timetable } from './timetable';
import { UniversityClass } from './university-class';
import { Event } from './event';
import { Note } from './note';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(): {} {
    const timetable: Timetable[] = [
      {id: 1, start_date: '17-11-2020', end_date: '17-12-2021', name: 'Semestr VII'}
    ];

    // const universityClasses: UniversityClass[] = [
    //   {id: 1, startTime: '10:00', endTime: '12:15', name: 'Matematyka Dyskretna', classroom: 'E301', dayOfWeek: 1, color: '#3498DB'},
    // ];

    const todayDate = new Date();
    const tomorrow = todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + (todayDate.getDate() + 1);
    const nextWeek = todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + (todayDate.getDate() + 7);

    const events: Event[] = [
        {
            id: 1, 
            color: '#3498DB', 
            name: 'Jakieś kolokwium', 
            startDatetime: new Date(tomorrow + ' 10:00'), 
            endDatetime: new Date(tomorrow + ' 13:00'), 
            allDayEvent: false, 
            description: 'kolokwium z czegos tam', 
            location: 'politechnika lubelska'
        },
        {
            id: 2, 
            color: '#3498DB', 
            name: 'All Day Test Event', 
            startDatetime: new Date(), 
            endDatetime: new Date(), 
            allDayEvent: true,
            location: 'Rdzewiak C102'
        },
        {
            id: 3, 
            color: '#3498DB', 
            name: 'Next week event', 
            startDatetime: new Date(nextWeek + ' 12:15'), 
            endDatetime: new Date(nextWeek + ' 13:00'), 
            allDayEvent: false
        },
        {
            id: 4, 
            color: '#3498DB', 
            name: 'All Day Test Event second', 
            startDatetime: new Date(), 
            endDatetime: new Date(), 
            allDayEvent: true
        },
    ];

    const notes: Note[] = [
        {id: 1, title: 'example note', htmlContent: `"<p>Notatka</p><h1>duzy header</h1><ul><li>a tu lista bedzie</li><li>drugi punkt</li><li><a href="https://google.com" rel="noopener noreferrer" target="_blank">jakis link sie wstawi</a></li></ul><pre class="ql-syntax" spellcheck="false">Może jakiś kawałek kodu?????? &lt;html&gt;kod&lt;/html&gt;</pre>"`},
        {id: 2, title: 'second', htmlContent: `"<p><strong>BOLD</strong></p><p><strong><em>INDENT</em></strong></p><p><strong><em><u>UNDER</u></em></strong></p><p><strong><em><s><u>STRIKE</u></s></em></strong></p><blockquote><strong><em><s><u>QUOTE</u></s></em></strong></blockquote><pre class="ql-syntax" spellcheck="false">CODE</pre><h1>HEADING1</h1><h2>HEADING2</h2><ol><li>ordered list</li></ol><ul><li>bullet list</li><li><sub>down</sub></li><li><sup>up</sup></li><li class="ql-indent-2"><sup>indent </sup>right</li><li class="ql-indent-1">indent left</li></ul><p style="direction: rtl; text-align: right;">REFT TO LIGHT</p><p>LARGE</p><p>LARGE</p><h6>heading6</h6><p><span style="color: rgb(230, 0, 0);">jakis bg color</span></p><p><br></p><p><span style="background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">a tutaj tez</span></p><p><br></p><p><span style="background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">sans serif</span></p><p><span style="font-family: serif; background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">serif</span></p><p><span style="font-family: monospace; background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">monospace</span></p><p><span style="font-family: monospace;">sadasd</span></p><p style="text-align: center;"><span style="font-family: monospace;">center</span></p><p style="text-align: right;"><span style="font-family: monospace;">right</span></p><p style="text-align: justify;">justifyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy y y y y y y yy                 y yy y yy y y y y yy y </p><p>a to nie wiem co robi???</p><p><a href="https://google.com/" rel="noopener noreferrer" target="_blank">link</a></p>"`},
        {id: 3, title: 'example note', htmlContent: `"<p>Notatka</p><h1>duzy header</h1><ul><li>a tu lista bedzie</li><li>drugi punkt</li><li><a href="https://google.com" rel="noopener noreferrer" target="_blank">jakis link sie wstawi</a></li></ul><pre class="ql-syntax" spellcheck="false">Może jakiś kawałek kodu?????? &lt;html&gt;kod&lt;/html&gt;</pre>"`},
        {id: 4, title: 'second', htmlContent: `"<p><strong>BOLD</strong></p><p><strong><em>INDENT</em></strong></p><p><strong><em><u>UNDER</u></em></strong></p><p><strong><em><s><u>STRIKE</u></s></em></strong></p><blockquote><strong><em><s><u>QUOTE</u></s></em></strong></blockquote><pre class="ql-syntax" spellcheck="false">CODE</pre><h1>HEADING1</h1><h2>HEADING2</h2><ol><li>ordered list</li></ol><ul><li>bullet list</li><li><sub>down</sub></li><li><sup>up</sup></li><li class="ql-indent-2"><sup>indent </sup>right</li><li class="ql-indent-1">indent left</li></ul><p style="direction: rtl; text-align: right;">REFT TO LIGHT</p><p>LARGE</p><p>LARGE</p><h6>heading6</h6><p><span style="color: rgb(230, 0, 0);">jakis bg color</span></p><p><br></p><p><span style="background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">a tutaj tez</span></p><p><br></p><p><span style="background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">sans serif</span></p><p><span style="font-family: serif; background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">serif</span></p><p><span style="font-family: monospace; background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">monospace</span></p><p><span style="font-family: monospace;">sadasd</span></p><p style="text-align: center;"><span style="font-family: monospace;">center</span></p><p style="text-align: right;"><span style="font-family: monospace;">right</span></p><p style="text-align: justify;">justifyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy y y y y y y yy                 y yy y yy y y y y yy y </p><p>a to nie wiem co robi???</p><p><a href="https://google.com/" rel="noopener noreferrer" target="_blank">link</a></p>"`},
        {id: 5, title: 'example note', htmlContent: `"<p>Notatka</p><h1>duzy header</h1><ul><li>a tu lista bedzie</li><li>drugi punkt</li><li><a href="https://google.com" rel="noopener noreferrer" target="_blank">jakis link sie wstawi</a></li></ul><pre class="ql-syntax" spellcheck="false">Może jakiś kawałek kodu?????? &lt;html&gt;kod&lt;/html&gt;</pre>"`},
        {id: 6, title: 'second', htmlContent: `"<p><strong>BOLD</strong></p><p><strong><em>INDENT</em></strong></p><p><strong><em><u>UNDER</u></em></strong></p><p><strong><em><s><u>STRIKE</u></s></em></strong></p><blockquote><strong><em><s><u>QUOTE</u></s></em></strong></blockquote><pre class="ql-syntax" spellcheck="false">CODE</pre><h1>HEADING1</h1><h2>HEADING2</h2><ol><li>ordered list</li></ol><ul><li>bullet list</li><li><sub>down</sub></li><li><sup>up</sup></li><li class="ql-indent-2"><sup>indent </sup>right</li><li class="ql-indent-1">indent left</li></ul><p style="direction: rtl; text-align: right;">REFT TO LIGHT</p><p>LARGE</p><p>LARGE</p><h6>heading6</h6><p><span style="color: rgb(230, 0, 0);">jakis bg color</span></p><p><br></p><p><span style="background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">a tutaj tez</span></p><p><br></p><p><span style="background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">sans serif</span></p><p><span style="font-family: serif; background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">serif</span></p><p><span style="font-family: monospace; background-color: rgb(0, 97, 0); color: rgb(230, 0, 0);">monospace</span></p><p><span style="font-family: monospace;">sadasd</span></p><p style="text-align: center;"><span style="font-family: monospace;">center</span></p><p style="text-align: right;"><span style="font-family: monospace;">right</span></p><p style="text-align: justify;">justifyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy y y y y y y yy                 y yy y yy y y y y yy y </p><p>a to nie wiem co robi???</p><p><a href="https://google.com/" rel="noopener noreferrer" target="_blank">link</a></p>"`},
    ];

    return {timetable, events, notes};
  }

  genId<T extends Timetable | UniversityClass | Event>(myTable: T[]): number {
    return myTable.length > 0 ? Math.max(...myTable.map(t => t.id)) + 1 : 11;
  }
}
