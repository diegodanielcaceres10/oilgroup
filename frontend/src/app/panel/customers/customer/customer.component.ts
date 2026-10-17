import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_shared/service/auth.service';
import { CustomerService } from '../../../_shared/service/customer.service';
import { UserService } from '../../../_shared/service/user.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CustomerComponent implements OnInit {

    access: any = {}
    paging!: boolean
    editMode!: boolean
    createMode!: boolean
    customer: any = {
        user: {},
        sales: [],
    }
    salesFiltered: any = []
    salesView: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    users: any = []
    conditions: any = ["IVA Responsable Inscripto", "IVA Responsable no Inscripto", "IVA no Responsable", "IVA Sujeto Exento", "Consumidor Final", "Responsable Monotributo", "Otro"]
    dialogs: any = []
    form: any = {}
    suscription: any

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private AuthService: AuthService,
        private CustomerService: CustomerService,
        private UserService: UserService,
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
            this.access = this.AuthService.getUser()
            const path = this.ActivatedRoute.snapshot.url[0].path
            if (path == "nuevo") {
                setTimeout(() => {
                    this.createMode = true
                    this.getData()
                }, 100)
            } else {
                const id = this.ActivatedRoute.snapshot.params["id"]
                this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
                this.find(parseInt(id))
            }
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    ngOnDestroy(): void {
        try {
            this.suscription && this.suscription.unsubscribe();
        } catch (e) {
            console.error("Error", e);
        }
    }

    find(id: any) {
        try {
            this.LoadService.change(true)
            this.CustomerService.find({ customer: { id: id }, }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.customer = res.data
                        this.salesFiltered = this.customer.sales
                        this.LoadService.change(false)
                        this.getData()
                        this.changePage(this.page)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar el cliente!")
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

    async getData() {
        try {
            if (["Super Administrador", "Administrador"].indexOf(this.access.role) > -1) {
                let filter = [{ name: "role", value: "Vendedor" }]
                await this.UserService.getAll({ filter: filter }).then((res: any) => {
                    if (res.status == "success") {
                        this.users = res.data
                    } else {
                        console.error("Response:", res.status)
                        this.HeaderService.showError("Error al encontrar los usuarios!")
                    }
                }).catch((e) => {
                    console.error("Error", e)
                    this.HeaderService.showError("Error en la conectividad")
                })
            }
            this.form = {
                title: this.createMode ? "Nuevo cliente. Datos obligatorios *" : "Editar cliente. Datos obligatorios *",
                event: this.createMode ? "createCustomerDialogConfirm" : "updateCustomerDialogConfirm",
                groups: [
                    {
                        fields: [
                            {
                                name: "id",
                                type: "hidden",
                                value: this.customer.id,
                            },
                            {
                                name: "username",
                                id: "user",
                                type: "select",
                                options: this.users.filter((i: any) => i.active),
                                nameValue: "username",
                                namesLabel: ["lastname", "firstname"],
                                symbol: "fas fa-user-tie",
                                label: "Vendedor",
                                value: this.customer.user && this.customer.user.username ? this.customer.user : { username: "", lastname: "", firstname: "" },
                                required: true,
                            },
                            {
                                name: "fantasy_name",
                                type: "text",
                                label: "Nombre de fantasía",
                                value: this.customer.fantasy_name,
                                required: true,
                            },
                            {
                                name: "document",
                                type: "text",
                                label: "CUIT/DNI",
                                value: this.customer.document,
                            },
                            {
                                name: "name",
                                type: "text",
                                label: "Razón Social/Apellido y nombre",
                                value: this.customer.name,
                                required: true,
                            },
                            {
                                name: "tax_condition",
                                type: "select",
                                options: this.conditions,
                                label: "Condición impositiva",
                                value: this.customer.tax_condition,
                                required: true,
                            },
                            {
                                name: "phone",
                                type: "text",
                                label: "Teléfono",
                                value: this.customer.phone,
                            },
                            {
                                name: "email",
                                type: "text",
                                label: "Correo electrónico",
                                value: this.customer.email,
                            },
                            {
                                name: "address",
                                type: "text",
                                label: "Dirección",
                                value: this.customer.address,
                            },
                            {
                                name: "schedule",
                                type: "text",
                                label: "Horarios",
                                value: this.customer.schedule,
                            },
                            {
                                name: "city",
                                type: "text",
                                label: "Localidad",
                                value: this.customer.city,
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
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    changePage(value: any) {
        try {
            this.paging = true
            this.salesView = []
            this.pages = Math.ceil(this.salesFiltered.length / this.maxitems)
            this.page = value > this.pages ? 1 : value
            this.Location.replaceState("/panel/clientes/" + this.customer.id + "/" + this.page)
            let list = this.salesFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.salesView = list
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    sendForm(data: any) {
        try {
            if (data) {
                if (data.event == "createCustomerDialogConfirm") {
                    this.createCustomerDialogConfirm(data.values)
                } else if (data.event == "updateCustomerDialogConfirm") {
                    this.updateCustomerDialogConfirm(data.values)
                } else {
                    setTimeout(() => {
                        this.HeaderService.showError("Error en el proceso")
                        this.dialogs.pop()
                    }, 100)
                }
            } else {
                this.editMode = false
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define dialogs
    createCustomerDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Crear cliente",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "createCustomer",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    updateCustomerDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Actualizar cliente",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "updateCustomer",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    printSummaryDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Generar resúmen de cuenta",
                message: "¿Estas seguro de continuar?",
                event: "printSummary",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data: any) {
        try {
            if (data) {
                if (data.event == "createCustomer") {
                    this.createCustomer(data.values)
                } else if (data.event == "updateCustomer") {
                    this.updateCustomer(data.values)
                } else if (data.event == "printSummary") {
                    this.printSummary()
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
    createCustomer(data: any) {
        try {
            this.CustomerService.create({ customer: data, }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.createMode = false
                        this.find(res.data)
                        this.Location.replaceState("/panel/clientes/" + res.data + "/1")
                        this.HeaderService.showSuccess("Cliente creado con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear el cliente!")
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

    updateCustomer(data: any) {
        try {
            this.CustomerService.update({ customer: data, }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.editMode = false
                        this.find(data.id)
                        this.HeaderService.showSuccess("Cliente actualizado con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al actualizar el cliente!")
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

    printSummary() {
        try {
            let customer = { ...this.customer }
            this.CustomerService.summary({ customer: customer, }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
            this.suscription = this.CustomerService.progress.subscribe((data: any) => {
                if (data.body && data.status == 200 && data.type == HttpEventType.Response) {
                    let blob: any = new Blob([data.body], { type: 'application/pdf' });
                    const objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl, '_blank');
                    this.suscription.unsubscribe();
                    this.dialogs = []
                } else if (data.error) {
                    console.error("Response ", data)
                    this.HeaderService.showError("Error en la conectividad")
                    this.dialogs.pop()
                }
            }), (e: any) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

}
