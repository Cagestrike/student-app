import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PostComment } from '../post-comment';
import { isGroupAdmin, isGroupGod } from '../api-utils';
import { UserService } from '../user.service';
import { GroupService } from '../group.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: 'app-post-comment',
    templateUrl: './post-comment.component.html',
    styleUrls: ['./post-comment.component.css']
})
export class PostCommentComponent implements OnInit {
    @Input() comment: PostComment;
    @Input() groupRole;
    @Input() groupId;
    @Output() commentDelete = new EventEmitter();
    @ViewChild('commentTextarea') commentArea;
    apiErrors;
    isCommentLoading;
    // private commentTextareaPlaceholder;

    // @ViewChild('commentTextarea', { static: false }) set commentArea(content) {
    //     if (content) { // initially setter gets called with undefined
    //         this.commentTextareaPlaceholder = content;
    //     }
    // }

    isCommentEditMode;
    commentText;

    constructor(
        private userService: UserService,
        private groupService: GroupService,
        private snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
    }

    hasManageAccessToComment() {
        return (
            isGroupAdmin(this.groupRole)
            || isGroupGod(this.groupRole)
            || this.comment.authorId === this.userService.getCurrentUser().id
        );
    }

    editComment(): void {
        this.isCommentEditMode = true;
        this.commentText = this.comment.comment;
        setTimeout(() => {
            console.log(this.commentArea.nativeElement);
            console.log(this.commentArea.nativeElement.focus()); // OK
        }, 1);

    }

    onCommentKeyPress(event) {
        if (event.key === 'Escape') {
            this.cancelEdit();
        } else if (event.key === 'Enter') {
            this.updateComment();
        }
    }

    updateComment() {
        if (!this.commentText) {
            return;
        }

        this.apiErrors = null;
        this.commentArea.nativeElement.blur();
        const comment = {
            comment: this.commentText
        } as PostComment;

        this.isCommentLoading = true;
        this.groupService.updateComment(comment, this.groupId, this.comment.id)
            .subscribe(result => {
                console.log(result);
                this.comment.comment = this.commentText;
                // this.comments.unshift(result.comment);
                // this.commentText = null;
                this.isCommentEditMode = false;
                this.isCommentLoading = false;
            }, error => {
                console.log(error);
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.isCommentLoading = false;
            })
    }

    deleteComment(): void {
        this.isCommentLoading = true;
        this.groupService.deleteComment(this.groupId, this.comment.id)
            .subscribe(result => {
                console.log(result);
                this.commentDelete.emit(this.comment.id);
                // this.comments.unshift(result.comment);
                // this.commentText = null;
                this.isCommentLoading = false;
            }, error => {
                console.log(error);
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.isCommentLoading = false;
            })
    }

    cancelEdit(): void {
        this.isCommentEditMode = false;
    }
}
