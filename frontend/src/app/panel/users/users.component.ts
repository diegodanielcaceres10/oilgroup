import { Component, OnInit } from '@angular/core';
import { NavService } from '../../_shared/service/nav.service';
import { LoadService } from '../../_shared/service/load.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    standalone: false
})
export class UsersComponent implements OnInit {

    constructor(
        private NavService: NavService,
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        this.LoadService.change(true)
        setTimeout(() => {
            this.NavService.page({ page: "user", subpage: "" })
        }, 0)
    }

}
