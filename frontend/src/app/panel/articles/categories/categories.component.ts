import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../_shared/service/category.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';
import { Category, CategoryUpdate } from '../../../_shared/models/category';
import { Dialog, DialogForm, DialogResponse } from '../../../_shared/models/dialog';
import { Filter } from '../../../_shared/models/filter';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CategoriesComponent implements OnInit {

    paging!: boolean
    categories: Category[] = []
    categoriesFiltered: Category[] = []
    categoriesView: Category[] = []
    page = 1
    pages = 1
    maxitems = 20
    filters: Filter[] = []
    dialogs: Dialog[] = []
    form: Partial<DialogForm> = {}

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private CategoryService: CategoryService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "article", subpage: "categories" })
            }, 0)
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            const params = this.ActivatedRoute.snapshot.queryParams
            this.filters = [
                {
                    name: "name",
                    parent: "c",
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
            this.categoriesFiltered = []
            this.categoriesView = []
            this.page = page
            this.CategoryService.getAll({ filter: this.filters }).then((res) => {
                if (res.status == "success") {
                    this.categories = res.data
                    this.categoriesFiltered = res.data
                    this.pages = Math.ceil(this.categoriesFiltered.length / this.maxitems)
                    this.changePage(this.page)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar las categorias!")
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

    changePage(value: number) {
        try {
            this.paging = true
            this.categoriesView = []
            this.page = value > this.pages ? 1 : value
            let params = ""
            for (const filter of this.filters) {
                if (filter.type != "hidden" && filter.id && filter.value && filter.value[filter.nameLabel] && filter.value[filter.nameLabel] != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel] : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel];
                } else if (filter.type != "hidden" && !filter.id && filter.value && filter.value != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value;
                }
            }
            this.Location.replaceState("panel/articulos/categorias/" + this.page + params)
            const list = this.categoriesFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.LoadService.change(false)
                this.categoriesView = list
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
                title: "Buscar categorias",
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

    updateCategoryDialogForm(data: Category) {
        try {
            this.dialogs.push({
                type: "form",
                title: "Actualizar categoria",
                span: "Esto afecta a todos los articulos de esta categoria",
                form: {
                    full: true,
                    title: "Editar categoría. Datos obligatorios *",
                    event: "updateCategoryDialogConfirm",
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

    updateCategoryDialogConfirm(data: CategoryUpdate) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Actualizar categoría",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "updateCategory",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data?: DialogResponse) {
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
                } else if (data.event == "updateCategoryDialogConfirm") {
                    this.updateCategoryDialogConfirm(data.values)
                } else if (data.event == "updateCategory") {
                    this.updateCategory(data.values)
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
    updateCategory(data: CategoryUpdate) {
        try {
            this.CategoryService.update({ category: data }).then((res) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.getAll(this.page)
                        this.HeaderService.showSuccess("Categoria actualizada con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al actualizar la categoria!")
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
