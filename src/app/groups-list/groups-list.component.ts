import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isGroupAdmin, isGroupGod } from '../api-utils';
import { AuthenticationService } from '../authentication.service';
import { Group } from '../group';
import { GroupMembersDialogComponent } from '../group-members-dialog/group-members-dialog.component';
import { GroupService } from '../group.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-groups-list',
    templateUrl: './groups-list.component.html',
    styleUrls: ['./groups-list.component.css']
})
export class GroupsListComponent implements OnInit {
    @Input() groups: Group[] = [];
    @Output() onGroupSelect = new EventEmitter();
    @Input() selectedGroupId;
    @Output() onLoading = new EventEmitter();
    @Output() refreshGroups = new EventEmitter();

    constructor(
        public dialog: MatDialog,
        private groupService: GroupService,
        private snackBar: MatSnackBar,
        private userService: UserService
    ) { }

    ngOnInit(): void {
    }

    handleSelectedGroupId(groupId): void {
        if (this.selectedGroupId === groupId) {
            this.selectedGroupId = null;
        } else {
            this.selectedGroupId = groupId;
        }
        this.onGroupSelect.emit(this.selectedGroupId);
    }

    showMembers(group): void {
        const dialogRef = this.dialog.open(GroupMembersDialogComponent, {
            data: {
                group
            }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }

    deleteGroup(groupId): void {
        this.onLoading.emit(true);
        this.groupService.deleteGroup(groupId)
            .subscribe(result => {
                this.refreshGroups.emit();
            }, error => {
                console.log(error);
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.onLoading.emit(false);
            });
    }

    leaveGroup(groupId): void {
        this.onLoading.emit(true);
        this.groupService.removeUserFromGroup(this.userService.getCurrentUser().id, groupId)
            .subscribe(result => {
                this.refreshGroups.emit();
            }, error => {
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                console.log(error);
                this.onLoading.emit(false);
            });
    }

    isGroupGod(role) {
        return isGroupGod(role);
    }

    isGroupAdmin(role) {
        return isGroupAdmin(role);
    }
}
