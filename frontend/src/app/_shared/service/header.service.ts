import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    @Output() showSuccessAlert: EventEmitter<any> = new EventEmitter()
    @Output() showErrorAlert: EventEmitter<any> = new EventEmitter()
    @Output() setBuyCart: EventEmitter<any> = new EventEmitter()
    @Output() setSaleCart: EventEmitter<any> = new EventEmitter()

    showSuccess(data: any) {
        this.showSuccessAlert.emit(data)
    }

    showError(data: any) {
        this.showErrorAlert.emit(data)
    }
}
