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
    private allPostsUrl = `${BASE_API_URL}/AllGroupsPosts`;
    private groupUserUrl = `${BASE_API_URL}/groupUser`;
    private groupUsersUrl = `${BASE_API_URL}/groupUsers`;
    private commentsUrl = `${BASE_API_URL}/comments`;
    private commentUrl = `${BASE_API_URL}/comment`;
    constructor(
        private http: HttpClient,
    ) { }

    getAllGroups(): Observable<any> {
        return this.http.get<any>(this.groupsUrl);
    }

    deleteGroup(groupId): Observable<any> {
        return this.http.delete<any>(`${this.groupsUrl}/${groupId}`)
    }

    getMyGroups(currentUserId): Observable<any> {
        return this.http.get<any>(`${this.myGroupsUrl}/${currentUserId}`);
    }

    createGroup(group: Group): Observable<any> {
        return this.http.post(this.groupsUrl, group);
    }

    joinGroup(groupId): Observable<any> {
        return this.http.post(`${this.joinGroupUrl}/${groupId}`, null);
    }

    removeUserFromGroup(userId, groupId): Observable<any> {
        return this.http.delete(`${this.groupUserUrl}/${userId}/${groupId}`);
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

    addComment(comment, groupId, postId): Observable<any> {
        return this.http.post(`${this.commentUrl}/${groupId}/${postId}`, comment);
    }

    updateComment(comment, groupId, commentId): Observable<any> {
        return this.http.put(`${this.commentUrl}/${groupId}/${commentId}`, comment);
    }

    deleteComment(groupId, commentId): Observable<any> {
        return this.http.delete(`${this.commentUrl}/${groupId}/${commentId}`);
    }

    getPostComments(groupId, postId): Observable<any> {
        return this.http.get(`${this.commentsUrl}/${groupId}/${postId}`);
    }

}
