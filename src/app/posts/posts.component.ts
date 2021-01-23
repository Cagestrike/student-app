import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AddMembersDialogComponent } from '../add-members-dialog/add-members-dialog.component';
import { isGroupAdmin, isGroupGod } from '../api-utils';
import { Group } from '../group';
import { GroupMembersDialogComponent } from '../group-members-dialog/group-members-dialog.component';
import { GroupService } from '../group.service';
import { Post } from '../post';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { UserService } from '../user.service';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
    private _groupId;
    @Input() group: Group;
    @Input() availableGroups: Group[] = [];
    @Input() availableGroupsById: Map<number, Group> = new Map<number, Group>();
    isLoading;
    posts: Post[] = [];
    @Output() refreshGroups = new EventEmitter();
    @Input()
    public set groupId(val: string) {
        this._groupId = val;
        console.log('hello from posts ' + this._groupId);

        this.getPosts(this._groupId);
    }

    log() {
        console.log(this.group);
        console.log(this.availableGroups);
        console.log(this.availableGroupsById);
    }

    // @Input()
    // public set group(val: string) {
    //     this._groupId = val;
    //     this.getPosts(this._groupId);
    // }


    constructor(
        public dialog: MatDialog,
        private groupService: GroupService,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // this.groupId = this.route.snapshot.paramMap.get('id');
        // this.groupId = this.route.paramMap.pipe(
        //     switchMap
        // )
    }

    getPosts(groupId): void {
        console.log('get posts from group ' + groupId);
        this.isLoading = true;
        if (groupId) {
            this.getPostsFromGroup(groupId);
        } else {
            this.getAllPosts();
        }
    }

    getPostsFromGroup(groupId): void {
        this.groupService.getPostsFromGroup(groupId)
            .subscribe(result => {
                this.posts = result;
                this.posts.sort((a, b) => {
                    return new Date(b.updated_at) > new Date(a.updated_at) ? 1
                        : new Date(b.updated_at) < new Date(a.updated_at) ? -1
                        : 0
                });
                this.isLoading = false;
            }, error => {
                this.posts = [];
                this.isLoading = false;
                console.log(error);
            });
    }

    onPostDelete(postId): void {
        this.posts.splice(this.posts.findIndex(post => post.id === postId), 1);
    }

    getAllPosts(): void {
        this.groupService.getAllPosts()
            .subscribe(result => {
                this.posts = result;
                this.posts.sort((a, b) => {
                    return new Date(b.updated_at) > new Date(a.updated_at) ? 1
                        : new Date(b.updated_at) < new Date(a.updated_at) ? -1
                        : 0
                });
                console.log(result);
                this.isLoading = false;
            }, error => {
                this.posts = [];
                console.log(error);
                this.isLoading = false;
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

    deleteGroup(groupId): void {
        this.isLoading = true
        this.groupService.deleteGroup(groupId)
            .subscribe(result => {
                this.refreshGroups.emit();
            }, error => {
                console.log(error);
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.isLoading = false
            });
    }

    leaveGroup(groupId): void {
        this.isLoading = true
        this.groupService.removeUserFromGroup(this.userService.getCurrentUser().id, groupId)
            .subscribe(result => {
                this.refreshGroups.emit();
            }, error => {
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                console.log(error);
                this.isLoading = false;
            });
    }

    createPost(): void {
        const dialogRef = this.dialog.open(PostDialogComponent, {
            width: '50vw',
            data: {
                selectedGroup: this.group,
                availableGroups: this.availableGroups
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.posts.unshift(result.post);
                console.log(this.posts)
            }
        });
    }

    openAddMembersDialog(group): void {
        console.log(group);

        const dialogRef = this.dialog.open(AddMembersDialogComponent, {
            // width: '50vw',
            data: {
                group: this.group,
            }
        });

        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         this.posts.unshift(result.post);
        //         console.log(this.posts)
        //     }
        // });
    }

    editGroup(group: Group): void {
        console.log(group);
        this.router.navigate(['group/' + group.id]);
    }

    getRelatedGroupByPost(post: Post): Group {
        return this.availableGroupsById.get(+post.Groups_idGroup);
    }

    isGroupGod(role) {
        return isGroupGod(role);
    }

    isGroupAdmin(role) {
        return isGroupAdmin(role);
    }
}
