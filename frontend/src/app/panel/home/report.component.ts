import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../_shared/service/report.service';
import { NavService } from '../../_shared/service/nav.service';
import { HeaderService } from '../../_shared/service/header.service';
import { LoadService } from '../../_shared/service/load.service';
import { Location } from '@angular/common';
import moment from 'moment';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReportComponent implements OnInit, OnDestroy {

    paging!: boolean
    metrics: any = {}
    path = ""
    report = ""
    filtered: any = []
    view: any = []
    page = 1
    pages = 1
    maxitems = 20
    filters: any = []
    dialogs: any = []
    suscription: any

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private ReportService: ReportService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "home", subpage: "" })
            }, 0)
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            this.path = this.ActivatedRoute.snapshot.url[1].path
            this.report = this.path == "actividades" ? "activities" : "payments"
            const params = this.ActivatedRoute.snapshot.queryParams
            this.filters = [
                {
                    name: "from",
                    type: "date",
                    label: "Desde",
                    value: params["desde"] || moment().format("YYYY-MM-01"),
                    required: true,
                },
                {
                    name: "to",
                    type: "date",
                    label: "Hasta",
                    value: params["hasta"] || moment().format("YYYY-MM-DD"),
                    required: true,
                },
                {
                    name: "fantasy_name",
                    type: "text",
                    label: "Nombre",
                    value: params["nombre"] || "",
                },
            ]
            this.getAll();
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

    getAll() {
        if (this.report == "payments") this.getPayments();
        if (this.report == "activities") this.getActivity();
    }

    getPayments() {
        try {
            this.paging = true
            this.filtered = []
            this.view = []
            this.page = 1
            this.pages = 0
            this.ReportService.getPayments({ filter: this.filters }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.metrics = res.data
                        this.filtered = res.data
                        this.pages = Math.ceil(this.filtered.length / this.maxitems)
                        this.changePage(this.page)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar las metricas!")
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

    getActivity() {
        try {
            this.paging = true
            this.filtered = []
            this.view = []
            this.page = 1
            this.pages = 0
            this.ReportService.getActivity({ filter: this.filters }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.metrics = res.data
                        this.filtered = res.data
                        this.pages = Math.ceil(this.filtered.length / this.maxitems)
                        this.changePage(this.page)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar las metricas!")
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
            this.view = []
            this.page = value > this.pages ? 1 : value
            let params = ""
            for (const filter of this.filters) {
                if (filter.type != "hidden" && filter.id && filter.value && filter.value[filter.nameLabel] && filter.value[filter.nameLabel] != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel] : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel];
                } else if (filter.type != "hidden" && !filter.id && filter.value && filter.value != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value;
                }
            }
            this.Location.replaceState("/panel/reporte/" + this.path + "/" + this.page + params)
            const list = this.metrics.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.LoadService.change(false)
                this.view = list
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.paging = false
            this.LoadService.change(false)
        }
    }

    // Define dialogs
    exportPaymentsDialogForm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Exportar listado",
                message: "¿Estas seguro de continuar?",
                event: "exportPayments",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    exportActivitiesDialogForm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Exportar listado",
                message: "¿Estas seguro de continuar?",
                event: "exportActivities",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    filterDialogForm() {
        const data: Record<string, any> = {}
        for (const filter of this.filters) {
            data[filter.name] = filter.value || ""
        }
        try {
            this.dialogs.push({
                type: "form",
                title: "Buscar registros",
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
                    this.getAll()
                    this.dialogs.pop()
                } else if (data.event == "exportPayments") {
                    this.exportPayments()
                } else if (data.event == "exportActivities") {
                    this.exportActivities()
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

    exportPayments() {
        try {
            this.ReportService.exportPayments({ filter: this.filters }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
            this.suscription = this.ReportService.progressPayments.subscribe({
                next: (data: any) => {
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
                },
                error: (e: any) => {
                    console.error("Error", e)
                    this.HeaderService.showError("Error en la conectividad")
                    this.dialogs.pop()
                }
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    exportActivities() {
        try {
            this.ReportService.exportActivities({ filter: this.filters }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
            this.suscription = this.ReportService.progressActivities.subscribe({
                next: (data: any) => {
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
                },
                error: (e: any) => {
                    console.error("Error", e)
                    this.HeaderService.showError("Error en la conectividad")
                    this.dialogs.pop()
                }
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

}
