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
    isShowFilesLoading
    commentFiles;
    isCommentEditMode;
    commentText;
    isShowFileUpload;
    isSingleCommentFileLoading = new Set<number>();
    @ViewChild('commentFileInput') commentFileInput;

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
            || this.isCommentAuthor()
        );
    }

    isCommentAuthor() {
        return this.comment.authorId === this.userService.getCurrentUser().id
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

    getCommentFiles() {
        this.isShowFilesLoading = true;
        this.groupService.getCommentFiles(this.groupId, this.comment.id).subscribe(result => {
            console.log(result);
            this.commentFiles = result;
            this.isShowFilesLoading = false;
        }, error => {
            console.log(error);
            this.isShowFilesLoading = false;
        })
    }

    onCommentFileChange(event) {
        console.log(event);
        if(event.target.files.length > 0) {
            const file = event.target.files[0];
            this.uploadFile(file);
        }
    }

    uploadFile(file) {
        this.isShowFilesLoading = true;
        this.groupService.addFileToComment(this.groupId, this.comment.id, file)
            .subscribe(result => {
                console.log(result);
                if(!this.commentFiles) {
                    this.commentFiles = [];
                }
                this.commentFiles.push(result.post);
                this.commentFileInput.nativeElement.value = null;
                this.isShowFilesLoading = false;
            }, error => {
                console.log(error.error);
                let err = '';
                error.error = JSON.parse(error.error);
                for(let msg of error.error.data) {
                    err += msg + '\n';
                }
                this.snackBar.open(err, null, {
                    duration: 6000
                });
                this.commentFileInput.nativeElement.value = null;
                this.isShowFilesLoading = false;
            })
    }

    showFileUpload() {
        this.isShowFileUpload = true;
    }
    
    deleteFile(file) {
        this.isSingleCommentFileLoading.add(file.id);
        this.groupService.deleteCommentFile(this.groupId, this.comment.id, file.id)
            .subscribe(result => {
                this.isSingleCommentFileLoading.delete(file.id);
                this.commentFiles.splice(this.commentFiles.findIndex(postFile => postFile.id === file.id), 1);
            }, error => {
                console.log(error);
                this.snackBar.open('Coś poszło nie tak...', null, {
                    duration: 3500
                });
                this.isSingleCommentFileLoading.delete(file.id);
            })
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
