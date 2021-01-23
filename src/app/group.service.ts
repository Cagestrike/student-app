import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from './api-utils';
import { Group } from './group';
import { Post } from './post';

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private groupsUrl = `${BASE_API_URL}/group`;
    private joinGroupUrl = `${BASE_API_URL}/joinGroup`;
    private myGroupsUrl = `${BASE_API_URL}/getUsersGroups`;
    private postsUrl = `${BASE_API_URL}/posts`;
    private postUrl = `${BASE_API_URL}/post`;
    private postFilesUrl = `${BASE_API_URL}/postData`
    private allPostsUrl = `${BASE_API_URL}/AllGroupsPosts`;
    private groupUserUrl = `${BASE_API_URL}/groupUser`;
    private groupUsersUrl = `${BASE_API_URL}/groupUsers`;
    private commentsUrl = `${BASE_API_URL}/comments`;
    private commentUrl = `${BASE_API_URL}/comment`;
    private groupUserPicUrl = `${BASE_API_URL}/groupUserPic`;
    private commentFilesUrl = `${BASE_API_URL}/commentDatas`;
    private commentFileUrl = `${BASE_API_URL}/commentData`;

    constructor(
        private http: HttpClient,
    ) { }

    getAllGroups(): Observable<any> {
        return this.http.get<any>(this.groupsUrl);
    }

    deleteGroup(groupId): Observable<any> {
        return this.http.delete<any>(`${this.groupsUrl}/${groupId}`)
    }

    getGroupDetails(groupId): Observable<any> {
        return this.http.get(`${this.groupsUrl}/${groupId}`);
    }

    getMyGroups(currentUserId): Observable<any> {
        return this.http.get<any>(`${this.myGroupsUrl}/${currentUserId}`);
    }

    createGroup(group: Group): Observable<any> {
        return this.http.post(this.groupsUrl, group);
    }

    updateGroup(groupId, group: Group): Observable<any> {
        return this.http.put(`${this.groupsUrl}/${groupId}`, group);
    }

    addGroupPhoto(data, groupId): Observable<any> {
        const filedata: FormData = new FormData();
        filedata.append('picture', data, data.name);
        return this.http.post(`${this.groupUserPicUrl}/${groupId}`, filedata);
    }

    joinGroup(groupId): Observable<any> {
        return this.http.post(`${this.joinGroupUrl}/${groupId}`, null);
    }

    removeUserFromGroup(userId, groupId): Observable<any> {
        return this.http.delete(`${this.groupUserUrl}/${userId}/${groupId}`);
    }

    addUserToGroup(userId, groupId): Observable<any> {
        return this.http.post(`${this.groupUserUrl}/${userId}/${groupId}`, null);
    }

    getPostsFromGroup(groupId): Observable<any> {
        return this.http.get<any>(`${this.postsUrl}/${groupId}`);
    }

    getAllPosts(): Observable<any> {
        return this.http.get<any>(this.allPostsUrl);
    }

    setRole(groupId, userId, role): Observable<any> {
        return this.http.put(`${this.groupUserUrl}/${userId}/${groupId}/${role}`, null);
    }

    makeAdmin(groupId, userId): Observable<any> {
        return this.setRole(groupId, userId, 'admin');
    }

    verifyUser(groupId, userId): Observable<any> {
        return this.setRole(groupId, userId, 'user');
    }

    getGroupMembers(groupId): Observable<any> {
        return this.http.get(`${this.groupUsersUrl}/${groupId}`);
    }

    createPost(post, groupId): Observable<any> {
        return this.http.post(`${this.postUrl}/${groupId}`, post);
    }

    deletePost(post: Post): Observable<any> {
        return this.http.delete(`${this.postUrl}/${post.Groups_idGroup}/${post.id}`);
    }

    updatePost(post: Post, groupId, postId): Observable<any> {
        return this.http.put(`${this.postUrl}/${groupId}/${postId}`, post);
    }

    getPostFiles(groupId, postId): Observable<any> {
        return this.http.get(`${this.postFilesUrl}/${groupId}/${postId}`);
    }

    addPostFile(groupId, postId, data): Observable<any> {
        const filedata: FormData = new FormData();
        filedata.append('data', data, data.name);
        return this.http.post(`${this.postFilesUrl}/${groupId}/${postId}`, filedata);
    }

    deletePostFile(groupId, postId, postFileId): Observable<any> {
        return this.http.delete(`${this.postFilesUrl}/${groupId}/${postId}/${postFileId}`)
    }

    addComment(comment, groupId, postId): Observable<any> {
        return this.http.post(`${this.commentUrl}/${groupId}/${postId}`, comment);
    }

    updateComment(comment, groupId, commentId): Observable<any> {
        return this.http.put(`${this.commentUrl}/${groupId}/${commentId}`, comment);
    }

    deleteComment(groupId, commentId): Observable<any> {
        return this.http.delete(`${this.commentUrl}/${groupId}/${commentId}`);
    }

    getCommentFiles(groupId, commentId): Observable<any> {
        return this.http.get(`${this.commentFilesUrl}/${groupId}/${commentId}`);
    }

    addFileToComment(groupId, commentId, data): Observable<any> {
        const filedata: FormData = new FormData();
        filedata.append('data', data, data.name);
        return this.http.post(`${this.commentFileUrl}/${groupId}/${commentId}`, filedata);
    }

    deleteCommentFile(groupId, commentId, commentDataId): Observable<any> {
        return this.http.delete(`${this.commentFileUrl}/${groupId}/${commentId}/${commentDataId}`);
    }

    getPostComments(groupId, postId): Observable<any> {
        return this.http.get(`${this.commentsUrl}/${groupId}/${postId}`);
    }

}
