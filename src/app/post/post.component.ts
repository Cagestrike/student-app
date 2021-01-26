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
    postFiles;
    @Input() relatedGroup: Group;
    @Output() postDelete = new EventEmitter();
    @ViewChild('commentTextarea') commentArea;
    @ViewChild('postFileInput') postFileInput;
    isPostLoading;
    areCommentsLoading;
    isWriteCommentMode;
    isCommentLoading;
    commentText;
    apiErrors;
    comments: PostComment[] = [];
    isFilesLoading;
    isShowFileUpload: boolean;

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
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.areCommentsLoading = false;
            });
    }

    getPostFiles() {
        this.isFilesLoading = true;
        this.groupService.getPostFiles(this.relatedGroup.id, this.post.id).subscribe(result => {
            console.log(result);
            this.postFiles = result;
            this.isFilesLoading = false;
        }, error => {
            console.log(error);
            this.isFilesLoading = false;
        })
    }

    showFileUpload() {
        this.isShowFileUpload = true;
    }

    onPostFileChange(event) {
        console.log(event);
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.uploadFile(file);
        }
    }

    uploadFile(file) {
        this.isFilesLoading = true;
        this.groupService.addPostFile(this.relatedGroup.id, this.post.id, file)
            .subscribe(result => {
                console.log(result);
                if(!this.postFiles) {
                    this.postFiles = [];
                }
                this.postFiles.push(result.post);
                this.postFileInput.nativeElement.value = null;
                this.isFilesLoading = false;
            }, error => {
                console.log(error);
                let err = '';
                for(let msg of error.error.error.data) {
                    err += msg + '\n';
                }
                this.snackBar.open(err, null, {
                    duration: 6000
                });
                this.postFileInput.nativeElement.value = null;
                this.isFilesLoading = false;
            })
    }

    isSinglePostLoading = new Set<number>();
    deleteFile(file) {
        this.isSinglePostLoading.add(file.id);
        this.groupService.deletePostFile(this.relatedGroup.id, this.post.id, file.id)
            .subscribe(result => {
                this.isSinglePostLoading.delete(file.id);
                this.postFiles.splice(this.postFiles.findIndex(postFile => postFile.id === file.id), 1);
            }, error => {
                console.log(error);
                this.snackBar.open('Coś poszło nie tak...', null, {
                    duration: 3500
                });
                this.isSinglePostLoading.delete(file.id);
            })
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
                this.isPostLoading = false;
            }, error => {
                console.log(error);
                this.snackBar.open(error.error, null, {
                    duration: 3500
                });
                this.isPostLoading = false;
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
            this.isPostAuthor()
            || this.relatedGroup.role === 'god'
            || this.relatedGroup.role === 'admin'
        );
    }

    isPostAuthor() {
        return this.post.authorId === this.userService.getCurrentUser().id
    }

    setWriteCommentMode(): void {
        this.isWriteCommentMode = true;
    }

}
