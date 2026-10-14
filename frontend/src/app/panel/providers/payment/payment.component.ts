import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderPaymentService } from '../../../_shared/service/provider_payment.service';
import { ProviderService } from '../../../_shared/service/provider.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    standalone: false
})
export class PaymentComponent implements OnInit {

    createMode: boolean
    payment: any = {
        provider: {},
    }
    providers: any = []
    methods: any = ["Efectivo", "Transferencia", "Deposito", "Tarjeta de cŕedito", "Tarjeta de débito", "Cheque", "Otro"]
    dialogs: any = []
    form: any = {}

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private ProviderPaymentService: ProviderPaymentService,
        private ProviderService: ProviderService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "provider", subpage: "providers" })
            }, 0)
            const id = this.ActivatedRoute.snapshot.params["id"]
            if (id == "nuevo") {
                this.payment.provider.id = this.ActivatedRoute.snapshot.queryParams["proveedor"] || 0
                this.ProviderService.getAll({}).then((res: any) => {
                    if (res.status == "success") {
                        this.providers = res.data
                        if (this.payment.provider.id > 0) {
                            this.payment.provider = this.providers.find(i => i.id == this.payment.provider.id)
                        }
                        setTimeout(() => {
                            this.createMode = true
                            this.form = {
                                title: "Nuevo cobro. Datos obligatorios *",
                                event: "createProviderPaymentDialogConfirm",
                                groups: [
                                    {
                                        fields: [
                                            {
                                                name: "fantasy_name",
                                                id: "provider",
                                                type: "select",
                                                options: this.providers.filter(i => i.active),
                                                nameValue: "id",
                                                nameLabel: "fantasy_name",
                                                label: "Proveedor",
                                                value: this.payment.provider,
                                                required: true,
                                                disabled: this.payment.provider.id ? true : false,
                                            },
                                            {
                                                name: "import",
                                                type: "number",
                                                label: "Importe",
                                                required: true,
                                            },
                                            {
                                                name: "ticket",
                                                type: "text",
                                                label: "Comprobante",
                                            },
                                            {
                                                name: "method",
                                                type: "select",
                                                options: this.methods,
                                                label: "Medio de pago",
                                                required: true,
                                            },
                                        ],
                                    },
                                ],
                                buttons: [
                                    {
                                        icon: "fas fa-check",
                                        text: "Guardar",
                                        type: "submit",
                                        primary: true,
                                    },
                                ],
                            }
                            this.LoadService.change(false)
                        }, 100)
                    } else {
                        console.error("Response:", res.status)
                        this.HeaderService.showError("Error al encontrar los proveedores!")
                    }
                }).catch((e) => {
                    console.error("Error", e)
                    this.HeaderService.showError("Error en la conectividad")
                })
            } else {
                this.find(parseInt(id))
            }
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    find(id) {
        try {
            this.LoadService.change(true)
            this.ProviderPaymentService.find({ payment: { id: id } }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.payment = res.data
                        this.payment.import = this.payment.import ? this.payment.import.toFixed(2) : ""
                        this.LoadService.change(false)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar el pago!")
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

    sendForm(data) {
        try {
            if (data) {
                this.createProviderPaymentDialogConfirm(data.values)
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define dialogs
    createProviderPaymentDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Crear pago",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "createPayment",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    cancelProviderPaymentDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Cancelar pago",
                message: "¿Estas seguro de continuar?",
                event: "cancelPayment",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define events
    responseDialog(data) {
        try {
            if (data) {
                if (data.event == "createPayment") {
                    this.createPayment(data.values)
                } else if (data.event == "cancelPayment") {
                    this.cancelPayment()
                } else {
                    setTimeout(() => {
                        this.HeaderService.showError("Error en el proceso")
                        this.dialogs.pop()
                    }, 100)
                }
            } else {
                this.dialogs.pop()
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    createPayment(data) {
        try {
            data.import = parseFloat(data.import)
            this.ProviderPaymentService.create({ payment: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.createMode = false
                        this.find(res.data)
                        this.Location.replaceState("/panel/proveedores/pago/" + res.data)
                        this.HeaderService.showSuccess("Pago creado con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear el pago!")
                    this.dialogs.pop()
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    cancelPayment() {
        try {
            let payment = { ...this.payment }
            this.ProviderPaymentService.cancel({ payment: payment }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.payment.status = "Cancelado"
                        this.HeaderService.showSuccess("Pago cancelado con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al cancelar el pago!")
                    this.dialogs.pop()
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

}
