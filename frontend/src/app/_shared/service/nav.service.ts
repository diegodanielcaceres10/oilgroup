import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavService {

    @Output() pageSelected = new EventEmitter<any>()

    page(data: any) {
        this.pageSelected.emit(data)
    }
}
