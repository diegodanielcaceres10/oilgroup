import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoadService } from '../../_shared/service/load.service';

@Component({
    selector: 'app-load',
    templateUrl: './load.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LoadComponent implements OnInit {

    @Input() color: boolean
    loading: boolean = true

    constructor(
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        this.LoadService.changeStatus.subscribe(data => {
            this.loading = data
        })
    }

}
