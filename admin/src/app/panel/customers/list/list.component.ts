import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../_shared/service/user.service';
import { CustomerService } from '../../../_shared/service/customer.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

    access: any = {}
    paging: boolean
    customers: any = []
    customersFiltered: any = []
    customersView: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    conditions: any = ["IVA Responsable Inscripto", "IVA Responsable no Inscripto", "IVA no Responsable", "IVA Sujeto Exento", "Consumidor Final", "Responsable Monotributo", "Otro"]
    filters: any = []
    dialogs: any = []

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private UserService: UserService,
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
                this.NavService.page({ page: "customer", subpage: "customers" })
            }, 0)
            this.access = this.UserService.getUser()
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            let params = this.ActivatedRoute.snapshot.queryParams
            this.filters = [
                {
                    name: "user",
                    type: ["Super Administrador", "Administrador"].indexOf(this.access.role) > -1 ? "text" : "hidden",
                    label: ["Super Administrador", "Administrador"].indexOf(this.access.role) > -1 ? "Vendedor" : null,
                    searchFields: ["lastname", "firstname"],
                    value: params["vendedor"] || "",
                },
                {
                    name: "fantasy_name",
                    type: "text",
                    label: "Nombre de Fantasía",
                    value: params["nombredefantasía"] || "",
                },
                {
                    name: "document",
                    type: "text",
                    label: "Documento",
                    value: params["documento"] || "",
                },
                {
                    name: "name",
                    type: "text",
                    label: "Nombre",
                    value: params["nombre"] || "",
                },
                {
                    name: "tax_condition",
                    type: "select",
                    options: this.conditions,
                    label: "Condición",
                    value: params["condición"] || "",
                },
                {
                    name: "phone",
                    type: "text",
                    label: "Teléfono",
                    value: params["teléfono"] || "",
                },
                {
                    name: "email",
                    type: "text",
                    label: "Correo electrónico ",
                    value: params["correoelectrónico"] || "",
                },
                {
                    name: "address",
                    type: "text",
                    label: "Dirección",
                    value: params["dirección"] || "",
                },
                {
                    name: "city",
                    type: "text",
                    label: "Localidad",
                    value: params["localidad"] || "",
                },
                {
                    name: "status",
                    parent: "c",
                    id: "active",
                    type: "select",
                    options: [
                        {
                            id: 1,
                            status: "Activo",
                        },
                        {
                            id: 0,
                            status: "Inactivo",
                        },
                    ],
                    nameValue: "id",
                    nameLabel: "status",
                    label: "Estado",
                    value: { status: params["estado"] == "Activo" ? "Activo" : params["estado"] == "Inactivo" ? "Inactivo" : "", id: params["estado"] == "Activo" ? "1" : params["estado"] == "Inactivo" ? "0" : "" },
                },
            ]
            this.getAll(this.page)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    getAll(page) {
        try {
            this.paging = true
            this.customersFiltered = []
            this.customersView = []
            this.page = page
            let filter = this.filters
            if (["Super Administrador", "Administrador"].indexOf(this.access.role) == -1) {
                filter.push({ name: "user", type: "hidden", value: this.access.username })
            }
            this.CustomerService.getAll({ filter: filter }).then((res: any) => {
                if (res.status == "success") {
                    this.customers = res.data
                    this.customersFiltered = res.data
                    this.pages = Math.ceil(this.customersFiltered.length / this.maxitems)
                    this.changePage(this.page)
                } else {
                    console.error("Response", res.status)
                    this.HeaderService.showError("Error al encontrar los clientes!")
                    this.paging = false
                    this.LoadService.change(false)
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.paging = false
                this.LoadService.change(false)
            })
        } catch (e) {
            console.error("Error", e)
            this.paging = false
            this.LoadService.change(false)
        }
    }

    changePage(value) {
        try {
            this.paging = true
            this.customersView = []
            this.page = value > this.pages ? 1 : value
            let params = ""
            for (let filter of this.filters) {
                if (filter.type != "hidden" && filter.id && filter.value && filter.value[filter.nameLabel] && filter.value[filter.nameLabel] != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel] : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel];
                } else if (filter.type != "hidden" && !filter.id && filter.value && filter.value != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value;
                }
            }
            this.Location.replaceState("/panel/clientes/" + this.page + params)
            let list = this.customersFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.LoadService.change(false)
                this.customersView = list
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.paging = false
            this.LoadService.change(false)
        }
    }

    // Define dialogs
    filterDialogForm() {
        try {
            this.dialogs.push({
                type: "form",
                title: "Buscar clientes",
                form: {
                    full: true,
                    event: "getAll",
                    groups: [
                        {
                            fields: this.filters,
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-search",
                            text: "Buscar",
                            type: "submit",
                        },
                    ],
                },
            })
        } catch (e) {
            console.error("Error", e)
        }

    }

    activeCustomerDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Editar cliente",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "activeCustomer",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data) {
        try {
            if (data) {
                if (data.event == "getAll") {
                    this.filters.map((i) => {
                        if (i.type == "select" && i.id) {
                            i.value = {}
                            i.value[i.nameValue] = data.values[i.id]
                            i.value[i.nameLabel] = data.values[i.name]
                        } else {
                            i.value = data.values[i.name] || ""
                        }
                    })
                    this.getAll(1)
                    this.dialogs.pop()
                } else if (data.event == "activeCustomer") {
                    this.activeCustomer(data.values)
                }
            } else {
                this.dialogs.pop()
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    activeCustomer(data) {
        try {
            this.CustomerService.active({ customer: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.getAll(1)
                        this.HeaderService.showSuccess("Cliente actualizado con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response", res.status)
                    this.HeaderService.showError("Error al proveedor el cliente!")
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
