import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getViewRoleByApiRole, isGroupAdmin, isGroupGod } from '../api-utils';
import { CreateNewGroupDialogComponent } from '../create-new-group-dialog/create-new-group-dialog.component';
import { Group } from '../group';
import { GroupMember } from '../group-member';
import { GroupService } from '../group.service';

@Component({
    selector: 'app-group-members-dialog',
    templateUrl: './group-members-dialog.component.html',
    styleUrls: ['./group-members-dialog.component.css']
})
export class GroupMembersDialogComponent implements OnInit {
    isLoading;
    isUnverified;
    noAccessError = 'Musisz poczekać na weryfikację przez administratora grupy';
    groupMembers: GroupMember[] = [];
    godMembers: GroupMember[] = [];
    adminMembers: GroupMember[] = [];
    userMembers: GroupMember[] = [];
    unverifiedMembers: GroupMember[] = [];
    group: Group;

    constructor(
        public dialogRef: MatDialogRef<CreateNewGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private groupService: GroupService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.group = this.data?.group;
        this.getMembers(this.group.id);
    }

    getMembers(groupId): void {
        this.isLoading = true;
        this.groupService.getGroupMembers(groupId)
            .subscribe(result => {
                this.groupMembers = result;
                this.godMembers = this.groupMembers.filter(groupMember => groupMember.role === 'god');
                this.adminMembers = this.groupMembers.filter(groupMember => groupMember.role === 'admin');
                this.userMembers = this.groupMembers.filter(groupMember => groupMember.role === 'user');
                this.unverifiedMembers = this.groupMembers.filter(groupMember => groupMember.role === 'unverified');
                this.isLoading = false;
                console.log(this.groupMembers);
            }, error => {
                console.log(error);
                if (error.error.includes('Nie masz uprawnień')) {
                    this.isUnverified = true;
                } else {

                }
                this.isLoading = false;
            });
    }

    verifyUser(userId): void {
        this.isLoading = true;
        this.groupService.verifyUser(this.group.id, userId)
            .subscribe(result => {
                this.getMembers(this.group.id);
                // this.isLoading = false;
            }, error => {
                console.log(error);
                this.isLoading = false;
            });
    }

    removeUser(userId): void {
        this.isLoading = true;
        this.groupService.removeUserFromGroup(userId, this.group.id)
            .subscribe(result => {
                this.getMembers(this.group.id);
            }, error => {
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                console.log(error);
                this.isLoading = false;
            });
    }

    makeAdmin(userId): void {
        this.isLoading = true;
        this.groupService.makeAdmin(this.group.id, userId)
            .subscribe(result => {
                this.getMembers(this.group.id);
            }, error => {
                console.log(error);
                if (error.error.includes('Nie masz uprawnień')) {
                    this.snackBar.open(error.error, null, {
                        duration: 3500
                    });
                }
                this.isLoading = false;
            });
    }

    getViewRoleByApiRole(role) {
        return getViewRoleByApiRole(role);
    }

    isGroupAdmin() {
        return isGroupAdmin(this.group.role);
    }

    isGroupGod() {
        return isGroupGod(this.group.role);
    }

    hasVerifyUserAccess() {
        return this.isGroupGod() || this.isGroupAdmin();
    }

}
