import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Group } from '../group';
import { GroupService } from '../group.service';
import { Post } from '../post';

@Component({
    selector: 'app-post-dialog',
    templateUrl: './post-dialog.component.html',
    styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent implements OnInit {
    isLoading;
    selectedGroup: Group;
    availableGroups: Group[] = []
    postToEdit: Post;
    isEditMode;
    postTitleControl = new FormControl('', [Validators.required]);
    postContentControl = new FormControl('', [Validators.required]);
    groupControl = new FormControl('', [Validators.required]);
    postForm = new FormGroup({
        title: this.postTitleControl,
        content: this.postContentControl,
        group: this.groupControl
    });

    apiKeyToFormControl = new Map()
        .set('title', this.postTitleControl)
        .set('post', this.postContentControl);
    apiErrors;

    constructor(
        public dialogRef: MatDialogRef<PostDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private groupService: GroupService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.selectedGroup = this.data?.selectedGroup;
        this.availableGroups = this.data?.availableGroups;
        this.postToEdit = this.data?.postToEdit;
        console.log(this.postToEdit);
        if (this.postToEdit) {
            this.isEditMode = true;
            this.postTitleControl.setValue(this.postToEdit.title);
            this.postContentControl.setValue(this.postToEdit.post);
        }
    }

    onGroupSelectChange(event): void {
        console.log(event);
    }

    savePost(): void {
        if (this.selectedGroup || this.isEditMode) {
            this.groupControl.setErrors(null);
        }
        if (this.postForm.invalid) {
            return;
        }

        for (const [key, value] of Object.entries(this.postForm.controls)) {
            value.setErrors(null);
        }
        this.apiErrors = null;
        this.postForm.setErrors(null);

        const post = {
            post: this.postContentControl.value,
            title: this.postTitleControl.value
        } as Post;

        const groupId = this.selectedGroup?.id ? this.selectedGroup.id : this.groupControl.value;

        this.isLoading = true;
        if (this.isEditMode) {
            this.groupService.updatePost(post, this.postToEdit.Groups_idGroup, this.postToEdit.id)
                .subscribe(result => {
                    console.log(result);
                    this.postToEdit.post = post.post;
                    this.postToEdit.title = post.title;
                    this.dialogRef.close({ post: this.postToEdit });
                    this.isLoading = false;
                }, error => {
                    this.postForm.setErrors({ genericError: true });
                    if (typeof error.error === 'string') {
                        error.error = JSON.parse(error.error);
                    }
                    console.log(error.error);
                    this.apiErrors = error.error;

                    if (this.apiErrors.message) {
                        this.postForm.setErrors({ genericApiErrors: true });
                    }
                    for (const [key, value] of Object.entries(this.apiErrors)) {
                        this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                    }

                    this.isLoading = false;
                })
        } else {
            this.groupService.createPost(post, groupId)
                .subscribe(result => {
                    console.log(result);
                    this.dialogRef.close({ post: result.post });
                    this.isLoading = false;
                }, error => {
                    this.postForm.setErrors({ genericError: true });
                    if (typeof error.error === 'string') {
                        error.error = JSON.parse(error.error);
                    }
                    console.log(error.error);
                    this.apiErrors = error.error;

                    if (this.apiErrors.message) {
                        this.postForm.setErrors({ genericApiErrors: true });
                    }
                    for (const [key, value] of Object.entries(this.apiErrors)) {
                        this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                    }

                    this.isLoading = false;
                });
        }
    }

}
