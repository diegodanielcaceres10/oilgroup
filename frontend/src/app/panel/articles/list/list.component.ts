import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_shared/service/auth.service';
import { ArticleService } from '../../../_shared/service/article.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListComponent implements OnInit {

    access: any = {}
    paging!: boolean
    articles: any = []
    articlesFiltered: any = []
    articlesView: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    filters: any = []
    dialogs: any = []

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private AuthService: AuthService,
        private ArticleService: ArticleService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "article", subpage: "articles" })
            }, 0)
            this.access = this.AuthService.getUser()
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            let params = this.ActivatedRoute.snapshot.queryParams
            this.filters = [
                {
                    name: "fantasy_name",
                    type: "text",
                    label: "Proveedor",
                    value: params["proveedor"] || "",
                },
                {
                    name: "brand",
                    type: "text",
                    label: "Marca",
                    value: params["marca"] || "",
                },
                {
                    name: "category",
                    type: "text",
                    label: "Categoria",
                    value: params["categoria"] || "",
                },
                {
                    name: "code",
                    type: "text",
                    label: "Código",
                    value: params["código"] || "",
                },
                {
                    name: "name",
                    parent: "a",
                    type: "text",
                    label: "Nombre",
                    value: params["nombre"] || "",
                },
                {
                    name: "stock_code",
                    type: "text",
                    label: "Código de stock",
                    value: params["códigodestock"] || "",
                },
                {
                    name: "size",
                    type: "text",
                    label: "Tamaño",
                    value: params["tamaño"] || "",
                },
                {
                    name: "variety",
                    type: "text",
                    label: "Variedad",
                    value: params["variedad"] || "",
                },
                {
                    name: "status",
                    parent: "a",
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

    getAll(page: number) {
        try {
            this.paging = true
            this.articlesFiltered = []
            this.articlesView = []
            this.page = page
            this.ArticleService.getAll({ filter: this.filters }).then((res: any) => {
                if (res.status == "success") {
                    this.articles = res.data
                    this.articlesFiltered = res.data
                    this.pages = Math.ceil(this.articlesFiltered.length / this.maxitems)
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
            this.articlesView = []
            this.page = value > this.pages ? 1 : value
            let params = ""
            for (let filter of this.filters) {
                if (filter.type != "hidden" && filter.id && filter.value && filter.value[filter.nameLabel] && filter.value[filter.nameLabel] != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel] : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel];
                } else if (filter.type != "hidden" && !filter.id && filter.value && filter.value != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value;
                }
            }
            this.Location.replaceState("/panel/articulos/" + this.page + params)
            let list = this.articlesFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.LoadService.change(false)
                this.articlesView = list
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
                title: "Buscar articulos",
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

    activeArticleDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Editar articulo",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "activeArticle",
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
                } else if (data.event == "activeArticle") {
                    this.activeArticle(data.values)
                }
            } else {
                this.dialogs.pop()
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    activeArticle(data: any) {
        try {
            this.ArticleService.active({ article: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.getAll(1)
                        this.HeaderService.showSuccess("Articulo actualizado con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al actualizar el articulo!")
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
