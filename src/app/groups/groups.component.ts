import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateNewGroupDialogComponent } from '../create-new-group-dialog/create-new-group-dialog.component';
import { FindGroupsDialogComponent } from '../find-groups-dialog/find-groups-dialog.component';
import { Group } from '../group';
import { GroupMembersDialogComponent } from '../group-members-dialog/group-members-dialog.component';
import { GroupService } from '../group.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
    myGroups: Group[] = [];
    myManagedGroups: Group[] = [];
    myVerifiedGroups: Group[] = [];
    myVerifiedGroupById: Map<number, Group> = new Map<number, Group>();
    isLoading;
    areMyGroupsLoading;
    selectedGroupId;
    selectedGroup;
    selectedIndex = 0;

    constructor(
        public dialog: MatDialog,
        private groupService: GroupService,
        private userService: UserService,
        private snackBar: MatSnackBar,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.getMyGroups();
        this.activatedRoute.queryParams.subscribe(params => {
            this.selectedGroupId = +params['group'];
            this.selectedGroup = this.myGroups.find(group => group.id === this.selectedGroupId);
        });
    }

    getMyGroups(): void {
        this.areMyGroupsLoading = true;
        this.groupService.getMyGroups(this.userService.getCurrentUser().id)
            .subscribe(result => {
                this.myGroups = result;
                console.log(this.myGroups)
                this.myManagedGroups = this.myGroups.filter(group => group.role === 'admin' || group.role === 'god');
                this.myVerifiedGroups = this.myGroups.filter(group => group.role !== 'unverified');
                this.myVerifiedGroups.forEach(group => {
                    this.myVerifiedGroupById.set(group.id, group);
                });
                if (this.selectedGroupId && this.myGroups.findIndex(group => group.id === this.selectedGroupId) === -1) {
                    this.selectedGroupId = null;
                    this.selectedGroup = null;
                } else if(this.selectedGroupId && this.myGroups.findIndex(group => group.id === this.selectedGroupId) != -1) {
                    this.selectedGroup = this.myGroups.find(group => group.id === this.selectedGroupId);
                }
                this.areMyGroupsLoading = false;
            }, error => {
                this.areMyGroupsLoading = false;
            });
    }

    // onOutletLoaded(component): void {
    //     component.group = this.selectedGroup;
    //     component.availableGroups = this.myVerifiedGroups;
    //     component.availableGroupsById = this.myVerifiedGroupById;
    // }

    findGroups(): void {
        const dialogRef = this.dialog.open(FindGroupsDialogComponent, {
            data: {
                myGroups: this.myGroups
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.refreshGroups) {
                this.getMyGroups();
            }
        });
    }

    handleSelectedGroupId(groupId): void {
        if (this.selectedGroupId === groupId) {
            this.selectedGroupId = null;
            this.selectedGroup = null;
            // this.location.go(`groups`);
        } else {
            // this.selectedGroupId = groupId;
            // this.selectedGroup = this.myGroups.find(group => group.id === groupId);
            this.router.navigate(
                [],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: { group: groupId },
                    queryParamsHandling: 'merge',
                    // skipLocationChange: true,

                }
            );
            // const url = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: {group: this.selectedGroupId}}).toString()
            // this.location.go(`${url}`);
        }
        this.selectedIndex = 0;
    }

    createGroup(): void {
        const dialogRef = this.dialog.open(CreateNewGroupDialogComponent, {
            width: '60vw',
            maxWidth: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.refreshGroups) {
                this.getMyGroups();
            }
        });
    }

    deleteGroup(groupId): void {
        this.areMyGroupsLoading = true;
        this.groupService.deleteGroup(groupId)
            .subscribe(result => {
                console.log(result);
                this.getMyGroups();
            }, error => {
                console.log(error);
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.areMyGroupsLoading = false;
            });
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

    handleGroupLoading(isLoading): void {
        this.areMyGroupsLoading = isLoading;
    }
}
