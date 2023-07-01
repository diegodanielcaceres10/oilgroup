import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_shared/service/auth.service';
import { HeaderService } from 'src/app/_shared/service/header.service';
import { trigger, style, animate, transition } from '@angular/animations';
import * as moment from 'moment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    animations: [
        trigger('alert',
            [
                transition(':enter',
                    [
                        style({ transform: "translateX(100%)" }), animate('.5s ease', style({ transform: "none" }))
                    ]
                ),
                transition(':leave',
                    [
                        style({ transform: "none" }), animate('.5s ease', style({ transform: "translateX(100%)" }))
                    ]
                )
            ]
        ),
    ],
})
export class HeaderComponent implements OnInit {

    access: any = {}
    alerts: any = []
    alert: any = {}
    show: boolean

    constructor(
        private AuthService: AuthService,
        private HeaderService: HeaderService,
    ) { }

    ngOnInit(): void {
        try {
            this.HeaderService.showSuccessAlert.subscribe(data => {
                this.alerts.push({
                    time: moment().format("HH:mm"),
                    type: "success",
                    text: data,
                });
                this.alert.type = "success";
                this.alert.text = data;
                setTimeout(() => {
                    this.alert = {};
                }, 5000);
            });
            this.HeaderService.showErrorAlert.subscribe(data => {
                this.alerts.push({
                    type: "error",
                    text: data,
                });
                this.alert.type = "error";
                this.alert.text = data;
                setTimeout(() => {
                    this.alert = {};
                }, 5000);
            });
            this.access = this.AuthService.getUser();
        } catch (e) {
            console.error("Error", e);
        }
    }

    async logout() {
        this.AuthService.logOut();
    }

}
