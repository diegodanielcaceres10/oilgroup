import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    @Output() showSuccessAlert = new EventEmitter<any>()
    @Output() showErrorAlert = new EventEmitter<any>()
    @Output() setBuyCart = new EventEmitter<any>()
    @Output() setSaleCart = new EventEmitter<any>()

    showSuccess(data: any) {
        this.showSuccessAlert.emit(data)
    }

    showError(data: any) {
        this.showErrorAlert.emit(data)
    }
}
