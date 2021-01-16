import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from '../group';
import { GroupService } from '../group.service';

@Component({
    selector: 'app-find-groups-dialog',
    templateUrl: './find-groups-dialog.component.html',
    styleUrls: ['./find-groups-dialog.component.css']
})
export class FindGroupsDialogComponent implements OnInit {
    genericError;
    apiError;
    allGroups: Group[] = [];
    currentlyDisplayedGroups: Group[] = [];
    isDialogLoading;
    searchedGroupName;
    groupIdsWhereRequestSentOut: Set<number> = new Set();
    doesJoinGroupRequestHaveError: Set<number> = new Set();

    constructor(
        public dialogRef: MatDialogRef<FindGroupsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private groupService: GroupService
    ) { }

    ngOnInit(): void {
        this.isDialogLoading = true;
        this.genericError = false;
        const myGroupIds = this.data?.myGroups.map(el => el.id);
        this.getAllGroups(myGroupIds);
    }

    getAllGroups(myGroupIds): void {
        this.groupService.getAllGroups()
            .subscribe(result => {
                this.allGroups = result.filter(group => myGroupIds.indexOf(group.id) === -1);
                this.currentlyDisplayedGroups = this.allGroups;
                this.isDialogLoading = false;
            }, error => {
                console.log(error);
                this.genericError = true;
                this.isDialogLoading = false;
            })
    }

    onSearchGroupNameChange(event): void {
        if (this.searchedGroupName) {
            this.currentlyDisplayedGroups = this.allGroups.filter(group =>
                group.name.toLowerCase().includes(this.searchedGroupName.toLowerCase())
            );
        } else {
            this.currentlyDisplayedGroups = this.allGroups;
        }
    }

    joinGroup(group: Group): void {
        this.isDialogLoading = true;
        this.apiError = null;
        this.genericError = null;
        this.groupService.joinGroup(group.id)
            .subscribe(result => {
                console.log(result);
                this.isDialogLoading = false;
                this.groupIdsWhereRequestSentOut.add(group.id);
            }, error => {
                console.log(error);
                this.isDialogLoading = false;
                if (error.error) {
                    this.apiError = error.error;
                }
                console.error(this.apiError);
            });
    }

    closeDialog(): void {
        this.groupIdsWhereRequestSentOut.size > 0
            ? this.dialogRef.close({ refreshGroups: true })
            : this.dialogRef.close({ refreshGroups: false });
    }

}
