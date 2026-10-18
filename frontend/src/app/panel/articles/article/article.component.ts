import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../_shared/service/article.service';
import { BrandService } from '../../../_shared/service/brand.service';
import { ProviderService } from '../../../_shared/service/provider.service';
import { CategoryService } from '../../../_shared/service/category.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';
import { HttpEventType } from '@angular/common/http';

/* AM Charts */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ArticleComponent implements OnInit, OnDestroy {

    paging!: boolean
    editMode!: boolean
    createMode!: boolean
    article: any = {
        provider: {},
    }
    filtered: any = []
    view: any = []
    page = 1
    pages = 1
    maxitems = 20
    providers: any = []
    brands: any = []
    categories: any = []
    tab = "rentabilidad"
    dialogs: any = []
    form: any = {}
    suscription: any

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private ArticleService: ArticleService,
        private ProviderService: ProviderService,
        private BrandService: BrandService,
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
                this.NavService.page({ page: "article", subpage: "" })
            }, 0)
            const path = this.ActivatedRoute.snapshot.url[0].path
            if (path == "nuevo") {
                setTimeout(() => {
                    this.article.provider.id = this.ActivatedRoute.snapshot.queryParams["proveedor"] || 0
                    this.createMode = true
                    this.getData()
                }, 100)
            } else {
                const id = this.ActivatedRoute.snapshot.params["id"]
                this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
                const param = this.ActivatedRoute.snapshot.queryParams["lista"];
                this.tab = param == "stock" ? "stock" : param == "medidas" ? "medidas" : param == "ventas" ? "ventas" : "rentabilidad"
                this.find(parseInt(id))
            }
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    ngOnDestroy(): void {
        try {
            if (this.suscription) {
                this.suscription.unsubscribe();
            }
        } catch (e) {
            console.error("Error", e);
        }
    }

    find(id: any) {
        try {
            this.LoadService.change(true)
            this.ArticleService.find({ article: { id: id } }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.article = res.data
                        this.getData()
                        this.setList(this.tab)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar el articulo!")
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
            await this.ProviderService.getAll({}).then((res: any) => {
                if (res.status == "success") {
                    this.providers = res.data
                    if (this.article.provider.id > 0) {
                        this.article.provider = this.providers.find((i: any) => i.id == this.article.provider.id)
                    }
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar los proveedores!")
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
            })
            await this.BrandService.getAll({}).then((res: any) => {
                if (res.status == "success") {
                    this.brands = res.data
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar las marcas!")
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
            })
            await this.CategoryService.getAll({}).then((res: any) => {
                if (res.status == "success") {
                    this.categories = res.data
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar las categorias!")
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
            })
            this.form = {
                title: this.createMode ? "Nuevo articulo. Datos obligatorios *" : "Editar articulo. Datos obligatorios *",
                event: this.createMode ? "createArticleDialogConfirm" : "updateArticleDialogConfirm",
                groups: [
                    {
                        fields: [
                            {
                                name: "id",
                                type: "hidden",
                                value: this.article.id,
                            },
                            {
                                name: "fantasy_name",
                                id: "provider",
                                type: "select",
                                options: this.providers.filter((i: any) => i.active),
                                nameValue: "id",
                                nameLabel: "fantasy_name",
                                label: "Proveedor",
                                value: this.article.provider,
                                required: true,
                                disabled: this.article.provider.id && this.createMode ? true : false,
                            },
                            {
                                name: "brand",
                                type: "select",
                                options: this.brands.map((i: any) => { return i.name }),
                                label: "Marca",
                                value: this.article.brand,
                                creatable: true,
                                required: true,
                            },
                            {
                                name: "category",
                                type: "select",
                                options: this.categories.map((i: any) => { return i.name }),
                                label: "Categoria",
                                value: this.article.category,
                                creatable: true,
                                required: true,
                            },
                            {
                                name: "name",
                                type: "text",
                                label: "Nombre",
                                value: this.article.name,
                                required: true,
                            },
                            {
                                name: "code",
                                type: "text",
                                symbol: "fas fa-barcode",
                                label: "Código de articulo",
                                value: this.article.code,
                                required: true,
                            },
                            {
                                name: "stock_code",
                                type: "text",
                                label: "Código de stock",
                                value: this.article.stock_code,
                                required: true,
                            },
                            {
                                name: "cost",
                                type: "number",
                                label: "Costo de compra",
                                value: this.article.cost,
                                symbol: "fas fa-dollar-sign",
                            },
                            {
                                name: "size",
                                type: "text",
                                label: "Tamaño",
                                value: this.article.size,
                            },
                            {
                                name: "variety",
                                type: "text",
                                label: "Variedad",
                                value: this.article.variety,
                            },
                            {
                                name: "description",
                                type: "textarea",
                                label: "Descripción",
                                value: this.article.description,
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
            setTimeout(() => {
                if (this.tab == "rentabilidad" && this.article.profitability && this.article.profitability.length > 0) this.profitabilityChart(this.article.profitability);
            }, 100);
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    profitabilityChart(data: any) {
        try {
            am4core.useTheme(am4themes_dataviz);
            am4core.useTheme(am4themes_animated);

            // Create chart instance
            const chart = am4core.create("profitability-chart", am4charts.XYChart);
            chart.data = data;

            // Create axes
            const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "item";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.renderer.height = 150;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            categoryAxis.renderer.labels.template.rotation = 270;
            categoryAxis.renderer.labels.template.maxWidth = 150;
            categoryAxis.renderer.labels.template.wrap = true;
            categoryAxis.renderer.labels.template.textAlign = "end";

            chart.yAxes.push(new am4charts.ValueAxis());

            // Create series
            const series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "total";
            series.dataFields.categoryX = "item";
            series.columns.template.tooltipText = "{categoryX}: [bold]${valueY}[/]";
            series.columns.template.fillOpacity = .8;

            // value config
            const valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "$ [bold]{valueY}[/]";
            valueLabel.label.dy = -8;
            chart.maskBullets = false;

        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    setList(value: any) {
        try {
            this.tab = value
            this.filtered = value == "medidas" ? this.article.prices : value == "ventas" ? this.article.sales : this.article.history
            this.changePage(1);
            if (value == "rentabilidad") {
                setTimeout(() => {
                    if (this.article.profitability && this.article.profitability.length > 0) this.profitabilityChart(this.article.profitability);
                }, 100);
            }
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    changePage(value: any) {
        try {
            this.paging = true
            this.view = []
            this.pages = Math.ceil(this.filtered.length / this.maxitems)
            this.page = value > this.pages ? 1 : value
            this.Location.replaceState("/panel/articulos/" + this.article.id + "/" + this.page + "?lista=" + this.tab)
            const list = this.filtered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.view = list
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.paging = false
            this.LoadService.change(false)
        }
    }

    sendForm(data: any) {
        try {
            if (data) {
                if (data.event == "createArticleDialogConfirm") {
                    this.createArticleDialogConfirm(data.values)
                } else if (data.event == "updateArticleDialogConfirm") {
                    this.updateArticleDialogConfirm(data.values)
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
    createArticleDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Crear articulo",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "createArticle",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    updateArticleDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Actualizar articulo",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "updateArticle",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    addMeasureDialogForm() {
        try {
            this.dialogs.push({
                type: "form",
                title: "Adicionar medida",
                form: {
                    full: true,
                    title: "Nueva medida. Datos obligatorios *",
                    event: "addMeasureDialogConfirm",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "article",
                                    type: "hidden",
                                    value: this.article.id
                                },
                                {
                                    name: "measure",
                                    type: "text",
                                    label: "Medida",
                                    required: true,
                                },
                                {
                                    name: "units",
                                    type: "number",
                                    label: "Cantidad de unidades",
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

    addMeasureDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Agregar medida",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "addMeasure",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    updateMeasureDialogForm(data: any) {
        try {
            this.dialogs.push({
                type: "form",
                title: "Editar medida",
                form: {
                    full: true,
                    title: "Editar medida. Datos obligatorios *",
                    event: "updateMeasureDialogConfirm",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "id",
                                    type: "hidden",
                                    value: data.id,
                                },
                                {
                                    name: "article",
                                    type: "hidden",
                                    value: data.article,
                                },
                                {
                                    name: "measure",
                                    type: "text",
                                    label: "Medida",
                                    value: data.measure,
                                    required: true,
                                },
                                {
                                    name: "units",
                                    type: "number",
                                    label: "Cantidad de unidades",
                                    value: data.units,
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

    updateMeasureDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Editar medida",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "updateMeasure",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    deleteMeasureDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Editar medida",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "deleteMeasure",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    exportSalesDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Exportar ventas del articulo",
                message: "¿Estas seguro de continuar?",
                event: "exportSales",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data: any) {
        try {
            if (data) {
                if (data.event == "createArticle") {
                    this.createArticle(data.values)
                } else if (data.event == "updateArticle") {
                    this.updateArticle(data.values)
                } else if (data.event == "addMeasureDialogConfirm") {
                    this.addMeasureDialogConfirm(data.values)
                } else if (data.event == "addMeasure") {
                    this.addMeasure(data.values)
                } else if (data.event == "updateMeasureDialogConfirm") {
                    this.updateMeasureDialogConfirm(data.values)
                } else if (data.event == "updateMeasure") {
                    this.updateMeasure(data.values)
                } else if (data.event == "deleteMeasure") {
                    this.deleteMeasure(data.values)
                } else if (data.event == "exportSales") {
                    this.exportSales()
                } else {
                    setTimeout(() => {
                        this.HeaderService.showError("Error en el proceso")
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
    createArticle(data: any) {
        try {
            data.cost = data.cost ? parseFloat(data.cost) : false
            this.ArticleService.create({ article: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.createMode = false
                        this.tab = "rentabilidad"
                        this.find(res.data)
                        this.Location.replaceState("/panel/articulos/" + res.data + "/1")
                        this.HeaderService.showSuccess("Articulo creado con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear el articulo!")
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

    updateArticle(data: any) {
        try {
            data.cost = data.cost ? parseFloat(data.cost) : false
            this.ArticleService.update({ article: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.editMode = false
                        this.find(data.id)
                        this.HeaderService.showSuccess("Articulo actualizado con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
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

    addMeasure(data: any) {
        try {
            data.units = parseInt(data.units)
            this.ArticleService.addMeasure({ price: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.find(this.article.id)
                        this.HeaderService.showSuccess("Medida creada con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear la medida!")
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

    updateMeasure(data: any) {
        try {
            this.ArticleService.updateMeasure({ price: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.find(this.article.id)
                        this.HeaderService.showSuccess("Medida eliminada con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al eliminar la medida!")
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

    deleteMeasure(data: any) {
        try {
            this.ArticleService.deleteMeasure({ price: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.find(this.article.id)
                        this.HeaderService.showSuccess("Medida actulizada con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al actualizar la medida!")
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

    exportSales() {
        try {
            const article = { ...this.article }
            this.ArticleService.exportSales({ article: article, }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
            this.suscription = this.ArticleService.progressSales.subscribe((data: any) => {
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
            }, (e: any) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

}
