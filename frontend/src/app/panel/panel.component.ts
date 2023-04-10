import { Component, OnInit } from '@angular/core';
import { LoadService } from '../_shared/service/load.service';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
})
export class PanelComponent implements OnInit {

    constructor(
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        this.LoadService.change(true)
    }

}
