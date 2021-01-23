import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-profile-picture',
    templateUrl: './profile-picture.component.html',
    styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent implements OnInit {
    @Input() src;

    constructor(
        private userService: UserService
    ) { }

    ngOnInit(): void {
        if(!this.src) {
            this.userService.getUserProfilePic().subscribe(result => {
                this.src = result[0]?.picUrl;
            })
        }
    }

}
