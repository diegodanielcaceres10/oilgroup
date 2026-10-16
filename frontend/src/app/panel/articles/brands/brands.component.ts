import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../_shared/service/brand.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BrandsComponent implements OnInit {

    paging: boolean
    brands: any = []
    brandsFiltered: any = []
    brandsView: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    filters: any = []
    dialogs: any = []
    form: any = {}

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private BrandService: BrandService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "article", subpage: "brands" })
            }, 0)
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            let params = this.ActivatedRoute.snapshot.queryParams
            this.filters = [
                {
                    name: "name",
                    parent: "b",
                    type: "text",
                    label: "Nombre",
                    value: params["nombre"] || "",
                },
            ]
            this.getAll(this.page)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    getAll(page: number) {
        try {
            this.paging = true
            this.brandsFiltered = []
            this.brandsView = []
            this.page = page
            this.BrandService.getAll({ filter: this.filters }).then((res: any) => {
                if (res.status == "success") {
                    this.brands = res.data
                    this.brandsFiltered = res.data
                    this.pages = Math.ceil(this.brandsFiltered.length / this.maxitems)
                    this.changePage(this.page)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar las marcas!")
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

    changePage(value: any) {
        try {
            this.paging = true
            this.brandsView = []
            this.page = value > this.pages ? 1 : value
            let params = ""
            for (let filter of this.filters) {
                if (filter.type != "hidden" && filter.id && filter.value && filter.value[filter.nameLabel] && filter.value[filter.nameLabel] != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel] : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel];
                } else if (filter.type != "hidden" && !filter.id && filter.value && filter.value != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value;
                }
            }
            this.Location.replaceState("/panel/articulos/marcas/" + this.page + params)
            let list = this.brandsFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.LoadService.change(false)
                this.brandsView = list
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
                title: "Buscar marcas",
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

    updateBrandDialogForm(data: any) {
        try {
            this.dialogs.push({
                type: "form",
                title: "Actualizar marca",
                form: {
                    full: true,
                    title: "Editar marca. Datos obligatorios *",
                    event: "updateBrandDialogConfirm",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "name",
                                    type: "hidden",
                                    value: data.name,
                                },
                                {
                                    name: "value",
                                    type: "text",
                                    label: "Nuevo nombre",
                                    value: data.name,
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
                },
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    updateBrandDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Actualizar marca",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "updateBrand",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data: any) {
        try {
            if (data) {
                if (data.event == "getAll") {
                    this.filters.map((i: any) => {
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
                } else if (data.event == "updateBrandDialogConfirm") {
                    this.updateBrandDialogConfirm(data.values)
                } else if (data.event == "updateBrand") {
                    this.updateBrand(data.values)
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
    updateBrand(data: any) {
        try {
            this.BrandService.update({ brand: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.getAll(this.page)
                        this.HeaderService.showSuccess("Marca actualizada con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al actualizar la marca!")
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
