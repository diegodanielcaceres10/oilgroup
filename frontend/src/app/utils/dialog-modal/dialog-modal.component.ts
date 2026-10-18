import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-dialog-modal',
    templateUrl: './dialog-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DialogModalComponent implements OnInit {

    @Input() dialog: any
    @Output() responseDialogModal = new EventEmitter<any>()

    paging!: boolean
    saving!: boolean
    columns: any = []
    data: any = []
    dataFiltered: any = []
    dataView: any = []
    page = 1
    pages = 1
    maxitems = 10
    search = ""

    constructor() { }

    ngOnInit(): void {
        if (this.dialog.type == "list") {
            this.columns = this.dialog.list ? this.dialog.list.columns : []
            this.data = this.dialog.list ? this.dialog.list.data : []
            this.updateFound()
        }
    }

    updateFound() {
        try {
            this.paging = true
            this.dataFiltered = this.data.filter((i: any) => i.name.toLowerCase().includes(this.search.toLowerCase()))
            this.pages = Math.ceil(this.dataFiltered.length / this.maxitems)
            this.changePage(1)
        } catch (e) {
            console.error("Error", e)
            this.paging = false
        }
    }

    changePage(value: any) {
        try {
            this.paging = true
            this.dataView = []
            this.page = value > this.pages ? 1 : value
            const list = this.dataFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.dataView = list
            }, 100)

        } catch (e) {
            console.error("Error", e)
            this.paging = false
        }
    }

    sendResponse(value: any) {
        this.responseDialogModal.emit(value)
    }

}
