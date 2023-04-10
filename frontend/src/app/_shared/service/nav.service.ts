import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavService {

    @Output() pageSelected: EventEmitter<any> = new EventEmitter()

    page(data) {
        this.pageSelected.emit(data)
    }
}
