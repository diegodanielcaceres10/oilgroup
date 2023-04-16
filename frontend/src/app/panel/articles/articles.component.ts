import { Component, OnInit } from '@angular/core';
import { NavService } from '../../_shared/service/nav.service';
import { LoadService } from '../../_shared/service/load.service';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
})
export class ArticlesComponent implements OnInit {

    constructor(
        private NavService: NavService,
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        this.LoadService.change(true)
        setTimeout(() => {
            this.NavService.page({ page: "article", subpage: "" })
        }, 0)
    }

}
