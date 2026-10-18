import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_shared/service/auth.service';
import { SaleService } from '../../../_shared/service/sale.service';
import { CustomerService } from '../../../_shared/service/customer.service';
import { ArticleService } from '../../../_shared/service/article.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SaleComponent implements OnInit {

    access: any = {}
    paging!: boolean
    error!: string
    editMode!: boolean
    createMode!: boolean
    block!: boolean
    showCart!: boolean
    sale: any = {
        user: {},
        customer: {},
        items: [],
        articles: [],
        details: [],
        total: 0,
        payment: {},
        status: "Pendiente",
    }
    customers: any = []
    articles: any = []
    documents: any = ["Factura A", "Factura B"]
    conditions: any = ["IVA Responsable Inscripto", "IVA Responsable no Inscripto", "IVA no Responsable", "IVA Sujeto Exento", "Consumidor Final", "Responsable Monotributo", "Otro"]
    methods: any = ["Efectivo", "Transferencia", "Deposito", "Tarjeta de cŕedito", "Tarjeta de débito", "Cheque", "Otro"]
    path = 0
    dialogs: any = []
    form: any = {}
    steps: any = []
    suscription: any

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private AuthService: AuthService,
        private SaleService: SaleService,
        private CustomerService: CustomerService,
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
                this.NavService.page({ page: "customer", subpage: "" })
            }, 0)
            this.access = this.AuthService.getUser()
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
            this.SaleService.find({ sale: { id: id } }).then((res: any) => {
                if (res.status == "success") {
                    this.sale = res.data
                    this.sale.total = this.sale.total ? this.sale.total.toFixed(2) : "0.00"
                    if (this.sale.status == "Pendiente") {
                        this.sale.articles = this.sale.items.filter((i: any) => i.article)
                        this.sale.details = this.sale.items.filter((i: any) => !i.article)
                        this.ArticleService.getPrices().then((res: any) => {
                            if (res.status == "success") {
                                this.articles = res.data
                                this.form =
                                {
                                    event: "reviewSaleDialogConfirm",
                                    buttons: [
                                        {
                                            icon: "fas fa-check",
                                            text: "Guardar",
                                            type: "confirm",
                                            primary: true,
                                        },
                                    ],
                                },
                                    setTimeout(() => {
                                        this.LoadService.change(false)
                                    }, 100)
                            } else {
                                console.error("Response:", res.status)
                                this.HeaderService.showError("Error al encontrar los articulos!")
                            }
                        }).catch((e) => {
                            console.error("Error", e)
                            this.HeaderService.showError("Error en la conectividad")
                        })
                    } else {
                        setTimeout(() => {
                            this.LoadService.change(false)
                        }, 100)
                    }
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar la venta!")
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
            this.sale.customer.id = this.ActivatedRoute.snapshot.queryParams["cliente"]
            if (this.sale.customer.id) this.block = true
            const sale = JSON.parse(sessionStorage.getItem("oilgroup-sale") ?? "null")
            if (sale) {
                if (this.sale.customer && this.sale.customer.id && sale.customer && this.sale.customer.id != sale.customer.id) {
                    sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
                } else {
                    this.sale = sale
                }
            }
            await this.ArticleService.getPrices().then((res: any) => {
                if (res.status == "success") {
                    this.articles = res.data
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar los articulos!")
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
            })
            const filter: { name: string, parent: string | null, value: string }[] = [
                { name: "active", parent: "c", value: "1" },
            ]
            if (["Super Administrador", "Administrador"].indexOf(this.access.role) == -1) {
                filter.push({ name: "user", parent: null, value: this.access.username })
            }
            await this.CustomerService.getAll({ filter: filter }).then((res: any) => {
                if (res.status == "success") {
                    this.customers = res.data
                    if (this.sale.customer && this.sale.customer.id > 0) {
                        this.sale.customer = this.customers.find((i: any) => i.id == this.sale.customer.id)
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
                    event: "setSale",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "status",
                                    type: ["Super Administrador", "Administrador"].indexOf(this.access.role) > -1 ? "radio" : "hidden",
                                    label: ["Super Administrador", "Administrador"].indexOf(this.access.role) > -1 ? "Estado de la venta" : null,
                                    radios: [
                                        {
                                            value: "Pendiente",
                                            text: "Pendiente",
                                        },
                                        {
                                            value: "Lista",
                                            text: "Lista",
                                        },
                                        {
                                            value: "Aprobada",
                                            text: "Aprobada",
                                        },
                                    ],
                                    value: this.sale.status || "Pendiente",
                                    required: true,
                                },
                                {
                                    name: "fantasy_name",
                                    id: "customer",
                                    type: "select",
                                    options: this.customers,
                                    nameValue: "id",
                                    nameLabel: "fantasy_name",
                                    label: "Cliente",
                                    value: this.sale.customer,
                                    required: true,
                                    disabled: this.block,
                                },
                                {
                                    name: "billing",
                                    type: "checkbox",
                                    text: "Factura digital en AFIP",
                                    value: this.sale.billing,
                                },
                                {
                                    name: "document",
                                    type: "select",
                                    options: this.documents,
                                    label: "Tipo de documento",
                                    value: this.sale.document,
                                    disabled: true,
                                },
                                {
                                    name: "description",
                                    type: "textarea",
                                    label: "Descripción",
                                    value: this.sale.description,
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
                    rules: [
                        {
                            name: "billing",
                            values: [true],
                            type: "required",
                            names: ["document"],
                        },
                        {
                            name: "billing",
                            values: [false],
                            type: "disabled",
                            names: ["document"],
                        },
                    ],
                },
                {
                    full: true,
                    title: "Articulos registrados con precios asignados y/o detalles adicionales",
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
                    title: "Confrmar el stock existente o remplazar por otro articulo",
                    event: "setStock",
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
                                    value: this.sale.payment ? this.sale.payment.status : true,
                                    text: "Registrar cobro a cliente",
                                },
                                {
                                    name: "import",
                                    type: "number",
                                    label: "Importe",
                                    symbol: "fas fa-dollar-sign",
                                    value: this.sale.payment ? this.sale.payment.import : "",
                                    required: true,
                                },
                                {
                                    name: "ticket",
                                    type: "text",
                                    label: "Comprobante",
                                    value: this.sale.payment ? this.sale.payment.ticket : "",
                                },
                                {
                                    name: "method",
                                    type: "select",
                                    options: this.methods,
                                    label: "Medio de pago",
                                    value: this.sale.payment ? this.sale.payment.method : "",
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
                    event: "createSaleDialogConfirm",
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
            if ((this.sale.articles && this.sale.articles.length > 0) || (this.sale.details && this.sale.details.length > 0)) {
                this.path = 1
            }
            if (this.sale.payment && this.sale.payment.import > 0) {
                this.path = 3
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

    sendForm(data: any) {
        try {
            if (data) {
                if (data.event == "back" && this.path > 0) {
                    this.path += -1
                    this.form = this.steps[this.path]
                } else if (data.event == "confirm") {
                    if (this.createMode) {
                        this.createSaleDialogConfirm()
                    } else if (this.editMode) {
                        this.reviewSaleDialogConfirm()
                    }
                } else if (data.event == "setSale") {
                    this.setSale(data.values)
                } else if (data.event == "setDetails") {
                    this.setDetails()
                } else if (data.event == "setStock") {
                    this.setStock()
                } else if (data.event == "setPayment") {
                    this.setPayment(data.values)
                } else if (data.event == "setStock") {
                    this.setStock()
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
    setSale(data: any) {
        try {
            const item = data
            this.steps[0].groups[0].fields[0].value = item.status
            this.steps[0].groups[0].fields[1].value = this.customers.find((i: any) => i.id == item.customer)
            this.steps[0].groups[0].fields[2].value = item.billing
            this.steps[0].groups[0].fields[3].value = item.document
            this.steps[0].groups[0].fields[4].value = item.description
            setTimeout(() => {
                this.sale.status = this.steps[0].groups[0].fields[0].value
                this.sale.customer = this.steps[0].groups[0].fields[1].value
                this.sale.billing = this.steps[0].groups[0].fields[2].value
                this.sale.document = this.steps[0].groups[0].fields[3].value
                this.sale.description = this.steps[0].groups[0].fields[4].value
                sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
                this.form = this.steps[1]
                this.path = 1
            }, 100)
        } catch (e) {
            console.error("Error", e)
        }
    }

    setDetails() {
        try {
            if (this.sale.articles.length == 0 && this.sale.details.length == 0) {
                this.error = "Debe adicionar al menos un item a la venta"
            } else {
                this.steps[2].title = this.sale.status == "Pendiente" ? "La revisión de stock quedará pendiente" : "Confrmar el stock existente o remplazar por otro articulo"
                this.form = this.steps[2]
                this.path = 2
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    setStock() {
        try {
            const item = this.sale.articles.find((i: any) => !i.review)
            if (this.sale.status != "Pendiente" && item) {
                this.error = "Debe confirmar la revisión de todos los articulos"
            } else {
                sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
                this.form = this.steps[3]
                this.path = 3
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    setPayment(data: any) {
        try {
            this.sale.payment = data
            this.steps[3].groups[0].fields[0].value = this.sale.payment.status
            this.steps[3].groups[0].fields[1].value = this.sale.payment.import
            this.steps[3].groups[0].fields[2].value = this.sale.payment.ticket
            this.steps[3].groups[0].fields[3].value = this.sale.payment.method
            sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
            setTimeout(() => {
                this.form = this.steps[4]
                this.path = 4
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
                event: "addArticleDialogForm",
                message: "Todos los articulos con precio definido",
                list: {
                    data: this.articles,
                    columns: [
                        {
                            type: "full",
                            values: [
                                {
                                    style: "quote",
                                    names: ["brand", "code", "fantasy_name"],
                                    divisor: " | ",
                                },
                                {
                                    style: "title",
                                    name: "name",
                                    bold: true,
                                },
                                {
                                    style: "subtitle",
                                    names: ["measure", "units"],
                                    divisor: " x ",
                                },
                                {
                                    style: "subtitle",
                                    names: ["size", "variety"],
                                    divisor: " ",
                                },
                            ],
                        },
                        {
                            type: "number",
                            values: [
                                {
                                    style: "title",
                                    name: "price_list",
                                    format: "decimal",
                                    bold: true,
                                },
                                {
                                    style: "title",
                                    name: "price_offer",
                                    format: "decimal",
                                },
                                {
                                    span: "precios",
                                },
                            ],
                        }
                    ],
                },
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    addArticleDialogForm(data: any) {
        try {
            const dataSelect = []
            if (data.price_list) dataSelect.push({ value: data.price_list, text: "Precio de Lista: $" + data.price_list })
            if (data.price_offer) dataSelect.push({ value: data.price_offer, text: "Precio de Oferta: $" + data.price_offer })
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
                                    name: "detail2",
                                    type: "text",
                                    label: "Medida",
                                    value: data.measure + " x " + data.units,
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
                                    name: "measure",
                                    type: "hidden",
                                    value: data.measure,
                                },
                                {
                                    name: "units",
                                    type: "hidden",
                                    value: data.units,
                                },
                                {
                                    name: "available",
                                    type: "hidden",
                                    value: data.stock,
                                },
                                {
                                    name: "price_text",
                                    id: "price",
                                    type: "select",
                                    options: dataSelect,
                                    nameValue: "value",
                                    nameLabel: "text",
                                    label: "Precio",
                                    symbol: "fas fa-dollar-sign",
                                    required: true,
                                },
                                {
                                    name: "quantity",
                                    type: "number",
                                    label: "Cantidad",
                                    required: true,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-check",
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
                            icon: "fas fa-check",
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

    addDiscountDialogForm() {
        try {
            this.dialogs.push({
                type: "form",
                title: "Adicionar descuento",
                form: {
                    full: true,
                    title: "El valor absoluto del descuento relativo sera calculado apartir de los items ya agregados. Datos obligatorios *",
                    event: "addDiscount",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "discount",
                                    type: "number",
                                    label: "Descuento en porcentaje",
                                    symbol: "fas fa-percentage",
                                    required: true,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-check",
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

    searchReplaceDialogList(data: any) {
        const article = data.article
        try {
            this.dialogs.push({
                type: "list",
                title: "Buscar remplazo",
                event: "addReplaceDialogForm",
                message: "Todos los articulos con precio definido",
                item: data,
                list: {
                    data: this.articles.filter((i: any) => i.id != article.id && i.stock > 0 && i.measure == "Unidad"),
                    columns: [
                        {
                            type: "full",
                            values: [
                                {
                                    style: "quote",
                                    names: ["brand", "code", "fantasy_name"],
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
                                    style: "title",
                                    name: "stock",
                                    label: "Stock disponible",
                                    bold: true,
                                },
                            ],
                        }
                    ],
                },
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    addReplaceDialogForm(item: any, data: any) {
        const article = data.article
        try {
            this.dialogs.push({
                type: "form",
                title: "Adicionar remplazo",
                form: {
                    full: true,
                    event: "addReplace",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "detail",
                                    type: "text",
                                    label: "Articulo vendido",
                                    value: article.brand + " " + article.name,
                                    disabled: true,
                                },
                                {
                                    name: "units",
                                    type: "number",
                                    label: "Cantidad vendida",
                                    value: article.stock,
                                    disabled: true,
                                },
                                {
                                    name: "index",
                                    type: "hidden",
                                    value: data.index,
                                },
                                {
                                    name: "id",
                                    type: "hidden",
                                    value: item.id,
                                },
                                {
                                    name: "name",
                                    type: "hidden",
                                    value: item.name,
                                },
                                {
                                    name: "brand",
                                    type: "hidden",
                                    value: item.brand,
                                },
                                {
                                    name: "detail2",
                                    type: "text",
                                    label: "Remplazo",
                                    value: item.brand + " " + item.name,
                                    disabled: true,
                                },
                                {
                                    name: "stock",
                                    type: "number",
                                    label: "Cantidad remplazada",
                                    max: article.stock,
                                    required: true,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-check",
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

    updateCountForm(data: any) {
        const article = data.article
        try {
            this.dialogs.push({
                type: "form",
                title: "Editar cantidad",
                form: {
                    full: true,
                    event: "updateCount",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "index",
                                    type: "hidden",
                                    value: data.index,
                                },
                                {
                                    name: "stock",
                                    type: "number",
                                    label: "Nueva aantidad",
                                    value: article.stock ,
                                    max: article.stock ,
                                    required: true,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-check",
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

    createSaleDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Crear venta",
                message: "¿Estas seguro de continuar?",
                event: "createSale",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    deliverSaleDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Entregar venta",
                message: "¿Estas seguro de continuar?",
                event: "deliverSale",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    reviewSaleDialogConfirm() {
        try {
            if (this.sale.articles.find((i: any) => !i.review && !i.deleted) || this.sale.details.find((i: any) => !i.review && !i.deleted)) {
                this.error = "Debe confirmar la revisión de todos los articulos y detalles adicionales"
            } else {
                this.dialogs.push({
                    type: "confirm",
                    title: "Confirmar stock",
                    message: "¿Estas seguro de continuar?",
                    event: "reviewSale",
                })
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    billingSaleDialogConfirm() {
        try {
            this.dialogs.push({
                type: "form",
                title: "Asociar factura",
                form: {
                    full: true,
                    title: "Datos obligatorios *",
                    event: "setBillingDialogConfirm",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "id",
                                    type: "hidden",
                                    value: this.sale.id,
                                },
                                {
                                    name: "ticket",
                                    type: "text",
                                    label: "N° de factura",
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

    setBillingDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Asignar facturación",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "billingSale",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    printTicketDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Generar remito",
                message: "¿Estas seguro de continuar?",
                event: "printTicket",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    cancelSaleDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Cancelar venta",
                message: "¿Estas seguro de continuar?",
                event: "cancelSale",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data: any) {
        try {
            if (data) {
                if (data.event == "addArticleDialogForm") {
                    this.addArticleDialogForm(data.values)
                } else if (data.event == "addArticle") {
                    this.addArticle(data.values)
                } else if (data.event == "addDetail") {
                    this.addDetail(data.values)
                } else if (data.event == "addDiscount") {
                    this.addDiscount(data.values)
                } else if (data.event == "addReplaceDialogForm") {
                    this.addReplaceDialogForm(data.values, data.item)
                } else if (data.event == "addReplace") {
                    this.addReplace(data.values)
                } else if (data.event == "updateCount") {
                    this.updateCount(data.values)
                } else if (data.event == "createSale") {
                    this.createSale()
                } else if (data.event == "reviewSale") {
                    this.reviewSale()
                } else if (data.event == "deliverSale") {
                    this.deliverSale()
                } else if (data.event == "setBillingDialogConfirm") {
                    this.setBillingDialogConfirm(data.values)
                } else if (data.event == "billingSale") {
                    this.billingSale(data.values)
                } else if (data.event == "printTicket") {
                    this.printTicket()
                } else if (data.event == "cancelSale") {
                    this.cancelSale()
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
    addArticle(data: any) {
        try {
            data.price = parseFloat(data.price)
            data.quantity = parseFloat(data.quantity)
            data.units = parseFloat(data.units) * data.quantity
            data.stock = data.units
            data.available = data.available
            data.subtotal = data.price * data.quantity
            this.sale.articles.push(data)
            this.sale.total += data.subtotal
            sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
            this.dialogs = []
            this.HeaderService.showSuccess("Articulo agregado con exito")
        } catch (e) {
            console.error("Error", e)
        }
    }

    removeArticle(data: any) {
        try {
            this.sale.articles.splice(this.sale.articles.indexOf(data), 1)
            this.sale.total -= data.subtotal
            sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
            this.HeaderService.showSuccess("Articulo eliminado con exito")
            this.path = 1
            this.showCart = false
        } catch (e) {
            console.error("Error", e)
        }
    }

    addDetail(data: any) {
        try {
            data.subtotal = parseFloat(data.subtotal)
            this.sale.details.push(data)
            this.sale.total += data.subtotal
            sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
            this.dialogs = []
            this.HeaderService.showSuccess("Detalle agregado con exito")
        } catch (e) {
            console.error("Error", e)
        }
    }

    removeDetail(data: any) {
        try {
            this.sale.details.splice(this.sale.details.indexOf(data), 1)
            this.sale.total -= data.subtotal
            sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
            this.HeaderService.showSuccess("Detalle eliminado con exito")
            this.path = 1
            this.showCart = false
        } catch (e) {
            console.error("Error", e)
        }
    }

    addDiscount(data: any) {
        try {
            const subtotal = this.sale.total * data.discount / 100 * -1
            const item = { concept: data.discount + "% OFF", subtotal: subtotal }
            this.sale.details.push(item)
            this.sale.total += subtotal
            sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
            this.dialogs = []
            this.HeaderService.showSuccess("Detalle agregado con exito")
        } catch (e) {
            console.error("Error", e)
        }
    }

    addReplace(data: any) {
        try {
            data.stock = parseFloat(data.stock)
            if (!this.sale.articles[data.index].replaces) this.sale.articles[data.index].replaces = []
            this.sale.articles[data.index].replaces.push(data)
            this.sale.articles[data.index].stock -= data.stock
            if (this.createMode) sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
            this.dialogs = []
            this.HeaderService.showSuccess("Sotck de articulo remplazado con exito")
        } catch (e) {
            console.error("Error", e)
        }
    }

    removeReplace(item: any, replace: any) {
        try {
            item.replaces.splice(item.replaces.indexOf(replace), 1)
            item.stock = + replace.stock
            if (this.createMode) sessionStorage.setItem("oilgroup-sale", JSON.stringify(this.sale))
            this.HeaderService.showSuccess("Remplazo eliminado con exito")
        } catch (e) {
            console.error("Error", e)
        }
    }

    updateCount(data: any) {
        try {
            data.stock = parseFloat(data.stock)
            this.sale.articles[data.index].stock = data.stock
            this.sale.articles[data.index].subtotal = this.sale.articles[data.index].price * this.sale.articles[data.index].stock
            this.sale.articles[data.index].edit = true
            this.dialogs = []
            this.HeaderService.showSuccess("Sotck de articulo remplazado con exito")
        } catch (e) {
            console.error("Error", e)
        }
    }

    createSale() {
        try {
            const sale = { ...this.sale }
            sale.payment.import = parseFloat(sale.payment.import)
            this.SaleService.create({ sale: sale }).then((res: any) => {
                if (res.status == "success") {
                    this.path = 5
                    setTimeout(() => {
                        this.createMode = false
                        this.find(res.data)
                        sessionStorage.removeItem("oilgroup-sale")
                        this.Location.replaceState("/panel/clientes/venta/" + res.data)
                        this.HeaderService.showSuccess("Venta creada con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear la venta!")
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

    reviewSale() {
        try {
            const sale = { ...this.sale }
            this.SaleService.review({ sale: sale }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.editMode = false
                        this.find(this.sale.id)
                        this.HeaderService.showSuccess("Stock confirmado con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al confirmar el stock!")
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

    deliverSale() {
        try {
            const sale = { ...this.sale }
            this.SaleService.deliver({ sale: sale }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.sale.status = "Aprobada"
                        this.HeaderService.showSuccess("Venta entregada con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al entregar la venta!")
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

    billingSale(data: any) {
        try {
            this.SaleService.billing({ sale: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.find(this.sale.id)
                        this.HeaderService.showSuccess("Factura asociada con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al asociar la factura!")
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

    printTicket() {
        try {
            const sale = { ...this.sale }
            this.SaleService.ticket({ sale: sale }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
            this.suscription = this.SaleService.progress.subscribe((data: any) => {
                if (data.body && data.status) {
                    const blob: any = new Blob([data.body], { type: 'application/pdf' });
                    const objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl, '_blank');
                    this.dialogs.pop()
                    this.suscription.unsubscribe();
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

    cancelSale() {
        try {
            const sale = { ...this.sale }
            this.SaleService.cancel({ sale: sale }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.sale.status = "Cancelada"
                        this.HeaderService.showSuccess("Venta cancelada con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al cancelar la venta!")
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
