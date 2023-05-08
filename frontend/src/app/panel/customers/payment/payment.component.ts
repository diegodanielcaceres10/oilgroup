import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../_shared/service/user.service';
import { CustomerPaymentService } from '../../../_shared/service/customer_payment.service';
import { CustomerService } from '../../../_shared/service/customer.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {

    access: any = {}
    createMode: boolean
    payment: any = {
        customer: {},
    }
    customers: any = []
    methods: any = ["Efectivo", "Transferencia", "Deposito", "Tarjeta de cŕedito", "Tarjeta de débito", "Cheque", "Otro"]
    dialogs: any = []
    form: any = {}

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private UserService: UserService,
        private CustomerPaymentService: CustomerPaymentService,
        private CustomerService: CustomerService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "customer", subpage: "" })
            }, 0)
            this.access = this.UserService.getUser()
            const id = this.ActivatedRoute.snapshot.params["id"]
            if (id == "nuevo") {
                this.payment.customer.id = this.ActivatedRoute.snapshot.queryParams["cliente"] || 0
                this.CustomerService.getAll({}).then((res: any) => {
                    if (res.status == "success") {
                        this.customers = res.data
                        if (this.payment.customer.id > 0) {
                            this.payment.customer = this.customers.find(i => i.id == this.payment.customer.id)
                        }
                        setTimeout(() => {
                            this.createMode = true
                            this.form = {
                                title: "Nuevo cobro. Datos obligatorios *",
                                event: "createCustomerPaymentDialogConfirm",
                                groups: [
                                    {
                                        fields: [
                                            {
                                                name: "fantasy_name",
                                                id: "customer",
                                                type: "select",
                                                options: this.customers.filter(i => i.active),
                                                nameValue: "id",
                                                nameLabel: "fantasy_name",
                                                label: "Cliente",
                                                value: this.payment.customer,
                                                required: true,
                                                disabled: true,
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
                                            {
                                                name: "account_name",
                                                type: "hidden",
                                                label: "Apellido y nombre",
                                            },
                                            {
                                                name: "account_bank",
                                                type: "hidden",
                                                label: "Banco",
                                            },
                                            {
                                                name: "number",
                                                type: "hidden",
                                                label: "Número de cheque",
                                            },
                                            {
                                                name: "cashing_date",
                                                type: "hidden",
                                                label: "Fecha de cobro",
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
                                rules: [
                                    {
                                        name: "method",
                                        values: ["Transferencia"],
                                        type: "text",
                                        names: ["account_name"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Transferencia"],
                                        type: "required",
                                        names: ["account_name"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Transferencia"],
                                        type: "enabled",
                                        names: ["account_name"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Transferencia", "Cheque"],
                                        type: "text",
                                        names: ["account_bank"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Transferencia", "Cheque"],
                                        type: "required",
                                        names: ["account_bank"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Transferencia", "Cheque"],
                                        type: "enabled",
                                        names: ["account_bank"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Cheque"],
                                        type: "text",
                                        names: ["number"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Cheque"],
                                        type: "date",
                                        names: ["cashing_date"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Cheque"],
                                        type: "required",
                                        names: ["number", "cashing_date"],
                                    },
                                    {
                                        name: "method",
                                        values: ["Cheque"],
                                        type: "enabled",
                                        names: ["number", "cashing_date"],
                                    },
                                ],
                            }
                            this.LoadService.change(false)
                        }, 100)
                    } else {
                        console.error("Response:", res.status)
                        this.HeaderService.showError("Error al encontrar los clientes!")
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
            this.CustomerPaymentService.find({ payment: { id: id } }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.payment = res.data
                        this.payment.import = this.payment.import ? this.payment.import.toFixed(2) : ""
                        this.LoadService.change(false)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar el cobro!")
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
                this.createCustomerPaymentDialogConfirm(data.values)
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define dialogs
    createCustomerPaymentDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Crear cobro",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "createPayment",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    cancelCustomerPaymentDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Cancelar cobro",
                message: "¿Estas seguro de continuar?",
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

    // Define events
    createPayment(data) {
        try {
            data.import = parseFloat(data.import)
            this.CustomerPaymentService.create({ payment: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.createMode = false
                        this.find(res.data)
                        this.Location.replaceState("/panel/clientes/cobro/" + res.data)
                        this.HeaderService.showSuccess("Cobro creado con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear el cobro!")
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
            this.CustomerPaymentService.cancel({ payment: payment }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.payment.status = "Cancelado"
                        this.HeaderService.showSuccess("Cobro cancelado con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al cancelar el cobro!")
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
