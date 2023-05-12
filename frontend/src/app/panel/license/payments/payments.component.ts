import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenseService } from '../../../_shared/service/license.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {

    paging: boolean
    license: any = {}
    filtered: any = []
    view: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    dialogs: any = []

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private LicenseService: LicenseService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "license", subpage: "" })
            }, 0)
            const id = this.ActivatedRoute.snapshot.params["id"]
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            this.find(parseInt(id))
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    find(id) {
        try {
            this.LoadService.change(true)
            this.LicenseService.find({ license: { id: id } }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.license = res.data
                        this.filtered = this.license.payments
                        this.LoadService.change(false)
                        this.changePage(1)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar el articulo!")
                    this.LoadService.change(false)
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.LoadService.change(false)
            })
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    changePage(value) {
        try {
            this.paging = true
            this.view = []
            this.pages = Math.ceil(this.filtered.length / this.maxitems)
            this.page = value > this.pages ? 1 : value
            this.Location.replaceState("/panel/licencia/" + this.license.id + "/" + this.page)
            let list = this.filtered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.view = list
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.paging = false
            this.LoadService.change(false)
        }
    }

    setPaymentDialogForm(data) {
        try {
            this.dialogs.push({
                type: "form",
                title: "Registrar pago",
                form: {
                    full: true,
                    event: "setPaymentDialogConfirm",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "id",
                                    type: "hidden",
                                    value: data.id,
                                },
                                {
                                    name: "license",
                                    type: "hidden",
                                    value: data.license,
                                },
                                {
                                    name: "total",
                                    type: "number",
                                    label: "Total",
                                    required: true,
                                },
                                {
                                    name: "date",
                                    type: "date",
                                    label: "Fecha de pago",
                                    required: true,
                                },
                                {
                                    name: "time",
                                    type: "time",
                                    label: "Hora de pago",
                                    required: true,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-check",
                            text: "Enviar",
                            type: "submit",
                            primary: true,
                        },
                    ],
                },
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    setPaymentDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Registrar pago de la cuota",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "setPayment",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    cancelPaymentDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Cancelar pago de la cuota",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "cancelPayment",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data) {
        try {
            if (data) {
                if (data.event == "setPaymentDialogConfirm") {
                    this.setPaymentDialogConfirm(data.values);
                } else if (data.event == "setPayment") {
                    this.setPayment(data.values);
                } else if (data.event == "cancelPayment") {
                    this.cancelPayment(data.values);
                } else {
                    setTimeout(() => {
                        this.HeaderService.showError("Error en el proceso")
                    }, 100)
                }
            } else {
                this.dialogs.pop()
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    setPayment(data) {
        try {
            data.total = data.total ? parseFloat(data.total) : false
            this.LicenseService.payment({ payment: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.HeaderService.showSuccess("Pago registrado con exito.");
                        this.dialogs = [];
                        this.find(this.license.id);
                    }, 100);
                } else {
                    console.error("Response:", res.status);
                    this.HeaderService.showError("Error al registrar el pago!");
                    this.dialogs.pop();
                }
            }).catch((e) => {
                console.error("Error", e);
                this.HeaderService.showError("Error en la conectividad");
                this.dialogs.pop();
            })
        } catch (e) {
            console.error("Error", e);
        }
    }

    cancelPayment(data) {
        try {
            this.LicenseService.cancel({ payment: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.HeaderService.showSuccess("Pago cancelado con exito.");
                        this.dialogs = [];
                        this.find(this.license.id);
                    }, 100);
                } else {
                    console.error("Response:", res.status);
                    this.HeaderService.showError("Error al cancelar el pago!");
                    this.dialogs.pop();
                }
            }).catch((e) => {
                console.error("Error", e);
                this.HeaderService.showError("Error en la conectividad");
                this.dialogs.pop();
            })
        } catch (e) {
            console.error("Error", e);
        }
    }

}
