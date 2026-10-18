import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadService {

    @Output() changeStatus = new EventEmitter<any>()

    change(data: any) {
        this.changeStatus.emit(data)
    }
}
