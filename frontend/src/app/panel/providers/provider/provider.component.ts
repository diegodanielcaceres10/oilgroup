import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from '../../../_shared/service/provider.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-provider',
    templateUrl: './provider.component.html',
    standalone: false
})
export class ProviderComponent implements OnInit {

    paging: boolean
    editMode: boolean
    createMode: boolean
    provider: any = {
        articles: [],
        buys: [],
    }
    filtered: any = []
    view: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    conditions: any = ["IVA Responsable Inscripto", "IVA Responsable no Inscripto", "IVA no Responsable", "IVA Sujeto Exento", "Consumidor Final", "Responsable Monotributo", "Otro"]
    tab: string = "compras"
    dialogs: any = []
    form: any = {}

    constructor(
        private ActivatedRoute: ActivatedRoute,
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
            const path = this.ActivatedRoute.snapshot.url[0].path
            if (path == "nuevo") {
                setTimeout(() => {
                    this.createMode = true
                    this.getData()
                }, 100)
            } else {
                const id = this.ActivatedRoute.snapshot.params["id"]
                this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
                this.tab = this.ActivatedRoute.snapshot.queryParams["lista"] == "articulos" ? "articulos" : "compras"
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
            this.ProviderService.find({ provider: { id: id } }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.provider = res.data
                        this.LoadService.change(false)
                        this.getData()
                        this.setList(this.tab)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar el proveedor!")
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
            this.form = {
                title: this.createMode ? "Nuevo proveedor. Datos obligatorios *" : "Editar proveedor. Datos obligatorios *",
                event: this.createMode ? "createProviderDialogConfirm" : "updateProviderDialogConfirm",
                groups: [
                    {
                        fields: [
                            {
                                name: "id",
                                type: "hidden",
                                value: this.provider.id,
                            },
                            {
                                name: "fantasy_name",
                                type: "text",
                                label: "Nombre de fantasía",
                                value: this.provider.fantasy_name,
                                required: true,
                            },
                            {
                                name: "name",
                                type: "text",
                                label: "Razón Social/Apellido y nombre",
                                value: this.provider.name,
                                required: true,
                            },
                            {
                                name: "tax_condition",
                                type: "select",
                                options: this.conditions,
                                label: "Condición impositiva",
                                value: this.provider.tax_condition,
                                required: true,
                            },
                            {
                                name: "phone",
                                type: "text",
                                label: "Teléfono",
                                value: this.provider.phone,
                            },
                            {
                                name: "email",
                                type: "text",
                                label: "Correo electrónico",
                                value: this.provider.email,
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

    setList(value) {
        try {
            this.tab = value
            this.filtered = value == "compras" ? this.provider.buys : this.provider.articles
            this.changePage(1)
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
            this.Location.replaceState("/panel/proveedores/" + this.provider.id + "/" + this.page + "?lista=" + this.tab)
            let list
            list = this.filtered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.view = list
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    sendForm(data) {
        try {
            if (data) {
                if (data.event == "createProviderDialogConfirm") {
                    this.createProviderDialogConfirm(data.values)
                } else if (data.event == "updateProviderDialogConfirm") {
                    this.updateProviderDialogConfirm(data.values)
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
    createProviderDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Crear proveedor",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "createProvider",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    updateProviderDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Actualizar proveedor",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "updateProvider",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data) {
        try {
            if (data) {
                if (data.event == "createProvider") {
                    this.createProvider(data.values)
                } else if (data.event == "updateProvider") {
                    this.updateProvider(data.values)
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
    createProvider(data) {
        try {
            this.ProviderService.create({ provider: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.createMode = false
                        this.tab = "compras"
                        this.find(res.data)
                        this.Location.replaceState("/panel/proveedores/" + res.data + "/1")
                        this.HeaderService.showSuccess("Proveedor creado con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear el proveedor!")
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

    updateProvider(data) {
        try {
            this.ProviderService.update({ provider: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.editMode = false
                        this.find(data.id)
                        this.HeaderService.showSuccess("Proveedor actualizado con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al actualizar el proveedor!")
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
