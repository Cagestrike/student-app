import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { Group } from '../group';
import { GroupService } from '../group.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../user.service';

interface User {
    id;
    name;
    secondName;
    email;
    birthday;
    profilePic;
}

@Component({
    selector: 'app-add-members-dialog',
    templateUrl: './add-members-dialog.component.html',
    styleUrls: ['./add-members-dialog.component.css']
})
export class AddMembersDialogComponent implements OnInit {
    group: Group;
    isDialogLoading;
    isUserLoading = new Set<number>();
    resultUsers: User[] = [];
    userIdsAlreadyInThisGroup = new Set<number>();
    userSearchInputModel;
    modelChanged: Subject<string> = new Subject<string>();
    isSearching;
    userIdsWhereRequestSentOut: Set<number> = new Set();
    doesAddUserRequestHaveError: Set<number> = new Set();

    constructor(
        public dialogRef: MatDialogRef<AddMembersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private groupService: GroupService,
        private userService: UserService,
        private matSnackBar: MatSnackBar
    ) {
        this.modelChanged.pipe(
            debounceTime(250),
            distinctUntilChanged())
            .subscribe(model => {
                this.isSearching = true;
                this.userService.searchUsers(model).subscribe(result => {
                    this.resultUsers = result;
                    this.resultUsers = this.resultUsers.filter(user => !this.userIdsAlreadyInThisGroup.has(user.id))
                    this.isSearching = false;
                }, error => {
                    console.log(error);
                    this.isSearching = false;
                })
            })
    }

    ngOnInit(): void {
        this.group = this.data?.group;
        this.isDialogLoading = true;
        this.groupService.getGroupMembers(this.group.id).subscribe(result => {
            console.log(result);
            if(result && result.length) {
                result.forEach(user => {
                    this.userIdsAlreadyInThisGroup.add(user.id);
                });
            }
            this.isDialogLoading = false;
        }, error => {
            console.log(error);
            this.isDialogLoading = false;
        });
    }

    changed(text: string) {
        this.modelChanged.next(text);
    }

    addUser(user: User) {
        this.isUserLoading.add(user.id);
        this.groupService.addUserToGroup(user.id, this.group.id)
            .subscribe(result => {
                this.userIdsWhereRequestSentOut.add(user.id);
                this.userIdsAlreadyInThisGroup.add(user.id);
                this.isUserLoading.delete(user.id);
            }, error => {
                console.log(error);
                this.isUserLoading.delete(user.id);

            });
        console.log(user);
    }

}
