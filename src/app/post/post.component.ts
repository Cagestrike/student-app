import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Group } from '../group';
import { GroupService } from '../group.service';
import { Post } from '../post';
import { PostComment } from '../post-comment';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { UserService } from '../user.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
    @Input() post: Post;
    @Input() relatedGroup: Group;
    @Output() postDelete = new EventEmitter();
    @ViewChild('commentTextarea') commentArea;
    isPostLoading;
    areCommentsLoading;
    isWriteCommentMode;
    isCommentLoading;
    commentText;
    apiErrors;
    comments: PostComment[] = [];

    constructor(
        private groupService: GroupService,
        private snackBar: MatSnackBar,
        private userService: UserService,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
    }

    showComments(post: Post): void {
        this.areCommentsLoading = true;
        this.groupService.getPostComments(post.Groups_idGroup, post.id)
            .subscribe(result => {
                console.log(result);
                this.comments = result;
                this.comments.sort((a, b) => {
                    return new Date(b.created_at) > new Date(a.created_at) ? 1
                        : new Date(b.created_at) < new Date(a.created_at) ? -1
                            : 0;
                })
                this.areCommentsLoading = false;
            }, error => {
                console.log(error);
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.areCommentsLoading = false;
            });
    }

    onCommentDelete(commentId) {
        this.comments.splice(this.comments.findIndex(comment => comment.id === commentId), 1);
    }

    onCommentKeyPress(event): void {
        if (event.key === 'Enter') {
            this.sendComment();
        }
    }

    sendComment(): void {
        if (!this.commentText) {
            return;
        }

        this.apiErrors = null;
        this.commentArea.nativeElement.blur();
        const comment = {
            comment: this.commentText
        } as PostComment;

        this.isCommentLoading = true;
        this.groupService.addComment(comment, this.post.Groups_idGroup, this.post.id)
            .subscribe(result => {
                console.log(result);
                this.comments.unshift(result.comment);
                this.commentText = null;
                this.isCommentLoading = false;
            }, error => {
                console.log(error);
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                this.apiErrors = error.error;
                this.isCommentLoading = false;
            })
    }

    deletePost(): void {
        this.isPostLoading = true;
        this.groupService.deletePost(this.post)
            .subscribe(result => {
                this.postDelete.emit(this.post.id);
                this.isCommentLoading = false;
            }, error => {
                console.log(error);
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.isCommentLoading = false;
            })
    }

    editPost(): void {
        const dialogRef = this.dialog.open(PostDialogComponent, {
            width: '50vw',
            data: {
                postToEdit: this.post
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                this.post = result.post;
            }
        });
    }

    hasManageAccessToPost(): boolean {
        return (
            this.post.authorId === this.userService.getCurrentUser().id
            || this.relatedGroup.role === 'god'
            || this.relatedGroup.role === 'admin'
        );
    }

    setWriteCommentMode(): void {
        this.isWriteCommentMode = true;
    }

}
