import { Component, OnInit } from '@angular/core';
import { UserService } from './_shared/service/user.service';
import { LoadService } from './_shared/service/load.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    environment: string = environment.name;

    constructor(
        private UserService: UserService,
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        this.LoadService.change(true)
        this.UserService.getCurrentSession();
    }
}
