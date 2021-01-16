import { Component, Input, OnInit } from '@angular/core';
import { GroupMember } from '../group-member';

@Component({
    selector: 'app-group-member-list-item',
    templateUrl: './group-member-list-item.component.html',
    styleUrls: ['./group-member-list-item.component.css']
})
export class GroupMemberListItemComponent implements OnInit {
    @Input() groupMember: GroupMember;

    constructor() { }

    ngOnInit(): void {
    }

}
