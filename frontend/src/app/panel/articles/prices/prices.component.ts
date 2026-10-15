import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_shared/service/auth.service';
import { ArticleService } from '../../../_shared/service/article.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'app-prices',
    templateUrl: './prices.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PricesComponent implements OnInit {

    access: any = {}
    paging: boolean
    articles: any = []
    articlesFiltered: any = []
    articlesView: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    filters: any = []
    dialogs: any = []
    form: any = {}
    suscription: any;

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
                this.NavService.page({ page: "article", subpage: "prices" })
            }, 0)
            this.access = this.AuthService.getUser();
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
                    name: "measure",
                    type: "text",
                    label: "Medida",
                    value: params["medida"] || "",
                },
            ]
            this.getAll(this.page)
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

    getAll(page) {
        try {
            this.paging = true
            this.articlesFiltered = []
            this.articlesView = []
            this.page = page
            this.ArticleService.getAllPrices({ filter: this.filters }).then((res: any) => {
                if (res.status == "success") {
                    this.articles = res.data
                    this.articlesFiltered = res.data
                    this.pages = Math.ceil(this.articlesFiltered.length / this.maxitems)
                    this.changePage(this.page)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar los articulos!")
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
            this.Location.replaceState("/panel/articulos/precios/" + this.page + params)
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
    exportDialogForm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Exportar lista de precios",
                message: "¿Estas seguro de continuar?",
                event: "exportPrices",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

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

    updatePriceDialogForm(data) {
        try {
            this.dialogs.push({
                type: "form",
                title: "Ajustar precio",
                form: {
                    full: true,
                    event: "updatePriceDialogConfirm",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "detail",
                                    type: "text",
                                    label: "Articulo",
                                    value: data.brand + " " + data.name,
                                    disabled: true,
                                },
                                {
                                    name: "detail2",
                                    type: "text",
                                    label: "Medida",
                                    value: data.measure,
                                    disabled: true,
                                },
                                {
                                    name: "id",
                                    type: "hidden",
                                    value: data.id,
                                },
                                {
                                    name: "price_list",
                                    type: "number",
                                    label: "Precio de lista",
                                    value: data.price_list,
                                    symbol: "fas fa-dollar-sign",
                                },
                                {
                                    name: "price_offer",
                                    type: "number",
                                    label: "Precio de oferta",
                                    value: data.price_offer,
                                    symbol: "fas fa-dollar-sign",
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

    updatePriceDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Actualizar precio",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "updatePrice",
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
                } else if (data.event == "updatePriceDialogConfirm") {
                    this.updatePriceDialogConfirm(data.values)
                } else if (data.event == "updatePrice") {
                    this.updatePrice(data.values)
                } else if (data.event == "exportPrices") {
                    this.exportPrices()
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
    updatePrice(data) {
        try {
            data.price_list = data.price_list ? parseFloat(data.price_list) : false
            data.price_offer = data.price_offer ? parseFloat(data.price_offer) : false
            this.ArticleService.updatePrices({ price: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.getAll(this.page)
                        this.HeaderService.showSuccess("Precios actualizados con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al actualizar los precios!")
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

    exportPrices() {
        try {
            this.ArticleService.exportPrices().catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
            this.suscription = this.ArticleService.progressPrices.subscribe((data: any) => {
                if (data.body && data.status == 200 && data.type == HttpEventType.Response) {
                    const blob: any = new Blob([data.body], { type: 'application/pdf' });
                    const objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl, '_blank');
                    this.suscription.unsubscribe();
                    this.dialogs = []
                } else if (data.error) {
                    console.error("Response ", data)
                    this.HeaderService.showError("Error en la conectividad")
                    this.dialogs.pop()
                }
            }), (e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

}
