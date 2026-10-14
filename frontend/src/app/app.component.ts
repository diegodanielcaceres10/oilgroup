import { Component, OnInit } from '@angular/core';
import { LoadService } from './_shared/service/load.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit {

    environment: string = environment.name;

    constructor(
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        this.LoadService.change(true);
    }
}
