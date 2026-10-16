import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadService {

    @Output() changeStatus: EventEmitter<any> = new EventEmitter()

    change(data: any) {
        this.changeStatus.emit(data)
    }
}
