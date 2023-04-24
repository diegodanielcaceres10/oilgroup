import { Component, OnInit } from '@angular/core';
import { NavService } from '../../_shared/service/nav.service';
import { LoadService } from '../../_shared/service/load.service';

@Component({
    selector: 'app-license',
    templateUrl: './license.component.html',
})
export class LicenseComponent implements OnInit {

    constructor(
        private NavService: NavService,
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        this.LoadService.change(true)
        setTimeout(() => {
            this.NavService.page({ page: "license", subpage: "" })
        }, 0)
    }

}
