import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuyService } from '../../../_shared/service/buy.service';
import { ProviderService } from '../../../_shared/service/provider.service';
import { ArticleService } from '../../../_shared/service/article.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-buy',
    templateUrl: './buy.component.html',
    standalone: false
})
export class BuyComponent implements OnInit {

    paging: boolean
    error: string = ""
    createMode: boolean
    block: boolean
    showCart: boolean
    buy: any = {
        provider: {},
        items: [],
        articles: [],
        details: [],
        total: 0,
        payment: {},
    }
    providers: any = []
    providersView: any = []
    articles: any = []
    articlesFiltered: any = []
    methods: any = ["Efectivo", "Transferencia", "Deposito", "Tarjeta de cŕedito", "Tarjeta de débito", "Cheque", "Otro"]
    path: number = 0
    dialogs: any = []
    form: any = {}
    steps: any = []

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private BuyService: BuyService,
        private ProviderService: ProviderService,
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
                this.NavService.page({ page: "provider", subpage: "" })
            }, 0)
            const id = this.ActivatedRoute.snapshot.params["id"]
            if (id == "nueva") {
                this.getData()
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
            this.BuyService.find({ buy: { id: id } }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.buy = res.data
                        this.buy.total = this.buy.total ? this.buy.total.toFixed(2) : "0.00"
                        this.LoadService.change(false)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar la compra!")
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
            this.buy.provider.id = this.ActivatedRoute.snapshot.queryParams["proveedor"]
            if (this.buy.provider.id) this.block = true
            let buy = JSON.parse(sessionStorage.getItem("oilgroup-buy"))
            if (buy) {
                if (this.buy.provider && this.buy.provider.id && buy.provider && this.buy.provider.id != buy.provider.id) {
                    sessionStorage.setItem("oilgroup-buy", JSON.stringify(this.buy))
                } else {
                    this.buy = buy
                }
            }
            await this.ProviderService.getAll({}).then((res: any) => {
                if (res.status == "success") {
                    this.providers = res.data
                    if (this.buy.provider && this.buy.provider.id > 0) {
                        this.buy.provider = this.providers.find(i => i.id == this.buy.provider.id)
                    }
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar los proveedores!")
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
            })
            this.steps = [
                {
                    full: true,
                    event: "setBuy",
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
                                    value: this.buy.provider,
                                    required: true,
                                    disabled: this.block,
                                },
                                {
                                    name: "ticket",
                                    type: "text",
                                    label: "N° de factura",
                                    value: this.buy.ticket,
                                },
                                {
                                    name: "description",
                                    type: "textarea",
                                    label: "Descripción",
                                    value: this.buy.description,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-chevron-right",
                            text: "Siguiente",
                            type: "next",
                            saving: true,
                        },
                    ],
                },
                {
                    full: true,
                    title: "Articulos registrados del proveedor y/o detalles adicionales",
                    event: "setDetails",
                    buttons: [
                        {
                            icon: "fas fa-chevron-left",
                            text: "Volver",
                            type: "back",
                        },
                        {
                            icon: "fas fa-chevron-right",
                            text: "Siguiente",
                            type: "next",
                        },
                    ],
                },
                {
                    full: true,
                    event: "setPayment",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "status",
                                    type: "checkbox",
                                    value: this.buy.payment ? this.buy.payment.status : true,
                                    text: "Registrar pago a proveedor",
                                },
                                {
                                    name: "import",
                                    type: "number",
                                    label: "Importe",
                                    symbol: "fas fa-dollar-sign",
                                    value: this.buy.payment ? this.buy.payment.import : "",
                                    required: true,
                                },
                                {
                                    name: "ticket",
                                    type: "text",
                                    label: "Comprobante",
                                    value: this.buy.payment ? this.buy.payment.ticket : "",
                                },
                                {
                                    name: "method",
                                    type: "select",
                                    options: this.methods,
                                    label: "Medio de pago",
                                    value: this.buy.payment ? this.buy.payment.method : "",
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-chevron-left",
                            text: "Volver",
                            type: "back",
                        },
                        {
                            icon: "fas fa-chevron-right",
                            text: "Siguiente",
                            type: "next",
                            saving: true,
                        },
                    ],
                    rules: [
                        {
                            name: "status",
                            values: [true],
                            type: "required",
                            names: ["import"],
                        },
                        {
                            name: "status",
                            values: [false],
                            type: "disabled",
                            names: ["import", "ticket", "method"],
                        },
                    ],
                },
                {
                    full: true,
                    event: "createBuyDialogConfirm",
                    buttons: [
                        {
                            icon: "fas fa-chevron-left",
                            text: "Volver",
                            type: "back",
                        },
                        {
                            icon: "fas fa-check",
                            text: "Guardar",
                            type: "confirm",
                            primary: true,
                        },
                    ],
                },
            ]
            if ((this.buy.articles && this.buy.articles.length > 0) || (this.buy.details && this.buy.details.length > 0)) {
                this.path = 1
                await this.getArticles(this.buy.provider.id)
            }
            if (this.buy.payment && this.buy.payment.import > 0) {
                this.path = 2
            }
            this.form = this.steps[this.path]
            setTimeout(() => {
                this.createMode = true
                this.LoadService.change(false)
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    async getArticles(id) {
        let filter = [
            { name: "provider", value: id },
            { name: "active", parent: "a", value: "1" },
        ]
        await this.ArticleService.getAll({ filter: filter }).then((res: any) => {
            if (res.status == "success") {
                this.articles = res.data
                this.articlesFiltered = this.articles
            } else {
                console.error("Response:", res.status)
                this.HeaderService.showError("Error al encontrar los articulos!")
            }
        }).catch((e) => {
            console.error("Error", e)
            this.HeaderService.showError("Error en la conectividad")
        })
    }

    sendForm(data) {
        try {
            if (data) {
                if (data.event == "back" && this.path > 0) {
                    this.path += -1
                    this.form = this.steps[this.path]
                } else if (data.event == "confirm") {
                    this.createBuyDialogConfirm()
                } else if (data.event == "setBuy") {
                    this.setBuy(data.values)
                } else if (data.event == "setDetails") {
                    this.setDetails()
                } else if (data.event == "setPayment") {
                    this.setPayment(data.values)
                } else {
                    setTimeout(() => {
                        this.HeaderService.showError("Error en el proceso")
                        this.dialogs.pop()
                    }, 100)
                }
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define steps events
    async setBuy(data) {
        try {
            let item = data
            let buy = JSON.parse(sessionStorage.getItem("oilgroup-buy"))
            this.steps[0].groups[0].fields[0].value = this.providers.find(i => i.id == item.provider)
            this.steps[0].groups[0].fields[1].value = item.ticket
            this.steps[0].groups[0].fields[2].value = item.description
            await this.getArticles(item.provider)
            setTimeout(() => {
                this.buy.provider = this.steps[0].groups[0].fields[0].value
                this.buy.ticket = this.steps[0].groups[0].fields[1].value
                this.buy.description = this.steps[0].groups[0].fields[2].value
                if (buy && buy.provider && buy.provider.id && buy.provider.id != this.buy.provider.id) this.buy.articles = []
                sessionStorage.setItem("oilgroup-buy", JSON.stringify(this.buy))
                this.form = this.steps[1]
                this.path = 1
            }, 100)
        } catch (e) {
            console.error("Error", e)
        }
    }

    setDetails() {
        try {
            if (this.buy.articles.length == 0 && this.buy.details.length == 0) {
                this.error = "Debe adicionar al menos un item a la compra"
            } else {
                this.form = this.steps[2]
                this.path = 2
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    setPayment(data) {
        try {
            this.buy.payment = data
            this.steps[2].groups[0].fields[0].value = this.buy.payment.status
            this.steps[2].groups[0].fields[1].value = this.buy.payment.import
            this.steps[2].groups[0].fields[2].value = this.buy.payment.ticket
            this.steps[2].groups[0].fields[3].value = this.buy.payment.method
            sessionStorage.setItem("oilgroup-buy", JSON.stringify(this.buy))
            setTimeout(() => {
                this.form = this.steps[3]
                this.path = 3
                this.showCart = true
            }, 100)
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define dialogs
    searchArticleDialogList() {
        try {
            this.dialogs.push({
                type: "list",
                title: "Buscar articulo",
                message: "Todos los articulos con precio definido",
                list: {
                    data: this.articlesFiltered,
                    columns: [
                        {
                            type: "full",
                            values: [
                                {
                                    style: "quote",
                                    names: ["brand", "code"],
                                    divisor: " | ",
                                },
                                {
                                    style: "title",
                                    names: ["name"],
                                    bold: true,
                                },
                                {
                                    style: "subtitle",
                                    names: ["size", "variety"],
                                    divisor: " ",
                                },
                                {
                                    style: "subtitle",
                                    names: ["category"],
                                },
                            ],
                        },
                        {
                            type: "number",
                            values: [
                                {
                                    style: "title",
                                    names: ["size", "variety"],
                                    divisor: " ",
                                    bold: true,
                                },
                                {
                                    span: "detalle",
                                },
                            ],
                        }
                    ],
                },
                event: "addArticleDialogForm",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    addArticleDialogForm(data) {
        try {
            this.dialogs.push({
                type: "form",
                title: "Adicionar articulo",
                form: {
                    full: true,
                    title: "Datos obligatorios *",
                    event: "addArticle",
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
                                    name: "id",
                                    type: "hidden",
                                    value: data.id,
                                },
                                {
                                    name: "brand",
                                    type: "hidden",
                                    value: data.brand,
                                },
                                {
                                    name: "name",
                                    type: "hidden",
                                    value: data.name,
                                },
                                {
                                    name: "quantity",
                                    type: "number",
                                    label: "Cantidad",
                                    required: true,
                                },
                                {
                                    name: "units",
                                    type: "number",
                                    label: "Unidades por paquete",
                                    required: true,
                                },
                                {
                                    name: "cost",
                                    type: "number",
                                    label: "Costo",
                                    symbol: "fas fa-dollar-sign",
                                    required: true,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-plus",
                            text: "Agregar",
                            type: "submit",
                        },
                    ],
                },
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    addDetailDialogForm() {
        try {
            this.dialogs.push({
                type: "form",
                title: "Adicionar detalle",
                form: {
                    full: true,
                    title: "Datos obligatorios *",
                    event: "addDetail",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "concept",
                                    type: "text",
                                    label: "Concepto",
                                    required: true,
                                },
                                {
                                    name: "subtotal",
                                    type: "number",
                                    label: "Subtotal",
                                    symbol: "fas fa-dollar-sign",
                                    required: true,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-plus",
                            text: "Agregar",
                            type: "submit",
                        },
                    ],
                },
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    createBuyDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Crear compra",
                message: "¿Estas seguro de continuar?",
                event: "createBuy",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    cancelBuyDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Cancelar compra",
                message: "¿Estas seguro de continuar?",
                event: "cancelBuy",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data) {
        try {
            if (data) {
                if (data.event == "addArticleDialogForm") {
                    this.addArticleDialogForm(data.values)
                } else if (data.event == "addArticle") {
                    this.addArticle(data.values)
                } else if (data.event == "addDetail") {
                    this.addDetail(data.values)
                } else if (data.event == "createBuy") {
                    this.createBuy()
                } else if (data.event == "cancelBuy") {
                    this.cancelBuy()
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
    addArticle(data) {
        try {
            data.cost = parseFloat(data.cost)
            data.quantity = parseInt(data.quantity)
            data.units = parseInt(data.units) * data.quantity
            data.subtotal = data.cost * data.quantity
            this.buy.articles.push(data)
            this.buy.total += data.subtotal
            sessionStorage.setItem("oilgroup-buy", JSON.stringify(this.buy))
            this.dialogs = []
            this.HeaderService.showSuccess("Articulo agregado con exito")
        } catch (e) {
            console.error("Error", e)
        }
    }

    removeArticle(data) {
        try {
            this.buy.articles.splice(this.buy.articles.indexOf(data), 1)
            this.buy.total -= data.subtotal
            sessionStorage.setItem("oilgroup-buy", JSON.stringify(this.buy))
            this.HeaderService.showSuccess("Articulo eliminado con exito")
            this.path = 1
            this.showCart = false
        } catch (e) {
            console.error("Error", e)
        }
    }

    addDetail(data) {
        try {
            data.subtotal = parseFloat(data.subtotal)
            this.buy.details.push(data)
            this.buy.total += data.subtotal
            sessionStorage.setItem("oilgroup-buy", JSON.stringify(this.buy))
            this.dialogs = []
            this.HeaderService.showSuccess("Articulo agregado con exito")
        } catch (e) {
            console.error("Error", e)
        }
    }

    removeDetail(data) {
        try {
            this.buy.details.splice(this.buy.details.indexOf(data), 1)
            this.buy.total -= data.subtotal
            sessionStorage.setItem("oilgroup-buy", JSON.stringify(this.buy))
            this.HeaderService.showSuccess("Detalle eliminado con exito")
            this.path = 1
            this.showCart = false
        } catch (e) {
            console.error("Error", e)
        }
    }

    createBuy() {
        try {
            let buy = { ...this.buy }
            buy.payment.import = buy.payment.import ? parseFloat(buy.payment.import) : false
            this.BuyService.create({ buy: buy }).then((res: any) => {
                if (res.status == "success") {
                    this.path = 5
                    setTimeout(() => {
                        this.createMode = false
                        this.find(res.data)
                        sessionStorage.removeItem("oilgroup-buy")
                        this.Location.replaceState("/panel/proveedores/compra/" + res.data)
                        this.HeaderService.showSuccess("Compra creada con exito")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear la compra!")
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

    cancelBuy() {
        try {
            let buy = { ...this.buy }
            this.BuyService.cancel({ buy: buy }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.buy.status = "Cancelada"
                        this.HeaderService.showSuccess("Compra cancelada con exito")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al cancelar la compra!")
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
