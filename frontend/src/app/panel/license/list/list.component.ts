import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenseService } from '../../../_shared/service/license.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

    paging: boolean
    licenses: any = []
    licensesFiltered: any = []
    licensesView: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    filters: any = []
    dialogs: any = []
    removesubscribe: any;

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private LicenseService: LicenseService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "license", subpage: "licenses" })
            }, 0)
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            let params = this.ActivatedRoute.snapshot.queryParams
            this.filters = [
            ]
            this.getAll(this.page)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false);
        }
    }

    ngOnDestroy() {
        try {
            this.removesubscribe = undefined;
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false);
        }
    }

    getAll(page) {
        try {
            this.paging = true
            this.licensesFiltered = []
            this.licensesView = []
            this.page = page
            this.LicenseService.getAll({ filter: this.filters }).then((res: any) => {
                if (res.status == "success") {
                    this.licenses = res.data
                    this.licensesFiltered = res.data
                    let current = this.licensesFiltered && this.licensesFiltered.find(i => i.current);
                    if (current) {
                        if (current.coefficient_validate) {
                            let validatetime = current.coefficient_validate && moment(current.coefficient_validate).add(-10, "minutes").format("YYYY-MM-DD, HH:mm:ss");
                            if (validatetime < moment().format("YYYY-MM-DD, HH:mm:ss")) {
                                current.coefficient = undefined;
                                current.coefficient_date = undefined;
                                current.coefficient_validate = undefined;
                                this.removePrice(current, (1000 * 60));
                            } else {
                                const timeout = moment(validatetime).diff(moment());
                                this.removePrice(current, timeout + (1000 * 60));
                            }
                        }
                    }
                    this.pages = Math.ceil(this.licensesFiltered.length / this.maxitems)
                    this.changePage(this.page)
                } else {
                    console.error("Response", res.status)
                    this.HeaderService.showError("Error al encontrar los usuarios!")
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
            this.licensesView = []
            this.page = value > this.pages ? 1 : value
            let params = ""
            for (let filter of this.filters) {
                if (filter.type != "hidden" && filter.id && filter.value && filter.value[filter.nameLabel] && filter.value[filter.nameLabel] != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel] : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel];
                } else if (filter.type != "hidden" && !filter.id && filter.value && filter.value != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value;
                }
            }
            this.Location.replaceState("/panel/licencia/" + this.page + params)
            let list = this.licensesFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.LoadService.change(false)
                this.licensesView = list
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
                title: "Buscar usuarios",
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

    setPriceDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Salvar cotización",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "setPrice",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    uploadTicketDialogForm(data) {
        try {
            this.dialogs.push({
                type: "form",
                title: "Adjuntar comprobante",
                form: {
                    full: true,
                    event: "uploadTicketDialogConfirm",
                    groups: [
                        {
                            fields: [
                                {
                                    name: "id",
                                    type: "hidden",
                                    value: data.id,
                                },
                                {
                                    name: "ticket",
                                    type: "file",
                                    label: "Comprobante",
                                    required: true,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            icon: "fas fa-check",
                            text: "Enviar",
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

    uploadTicketDialogConfirm(data) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Enviar comprobante",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "uploadTicket",
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
                } else if (data.event == "setPrice") {
                    this.setPrice(data.values);
                } else if (data.event == "uploadTicketDialogConfirm") {
                    this.uploadTicketDialogConfirm(data.values);
                } else if (data.event == "uploadTicket") {
                    this.uploadTicket(data.values);
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

    calcDollar(data) {
        try {
            data.loading = true;
            this.LicenseService.getDollar().then((res: any) => {
                data.coefficient = res;
                data.coefficient_date = moment();
                data.coefficient_validate = moment().add(1, "day");
                data.calc = true;
                data.loading = false;
            }).catch((e) => {
                console.error("Error", e);
                this.HeaderService.showError("Error al calcular la cotización");
            })
        } catch (e) {
            console.error("Error", e);
        }
    }

    setPrice(data) {
        try {
            this.LicenseService.price({ license: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.HeaderService.showSuccess("Cotización reservada con exito. Deberá adjuntar el comprobante durante las proximas 24 horas");
                        data.calc = false;
                        this.dialogs.pop();
                        this.removePrice(data, (1000 * 60 * 60 * 24) + (1000 * 60));
                    }, 100)
                } else {
                    console.error("Response", res.status);
                    this.HeaderService.showError("Error al reservaar la cotización!");
                    this.dialogs.pop();
                }
            }).catch((e) => {
                console.error("Error", e);
                this.HeaderService.showError("Error en la conectividad");
                this.dialogs.pop();
            })
        } catch (e) {
            console.error("Error", e);
        }
    }

    removePrice(data, timeout) {
        try {
            setTimeout(() => {
                this.LicenseService.remove({ license: data }).then((res: any) => {
                    if (res.status == "success") {
                        if (res.remove) {
                            data.coefficient = undefined;
                            data.coefficient_date = undefined;
                            data.coefficient_validate = undefined;
                        }
                    } else {
                        console.error("Response", res.status);
                    }
                }).catch((e) => {
                    console.error("Error", e);
                });
            }, timeout);
        } catch (e) {
            console.error("Error", e);
        }
    }

    uploadTicket(data) {
        try {
            this.LicenseService.upload(data).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.HeaderService.showSuccess("Comprobante adjunto con exito.");
                        this.dialogs = [];
                        this.licensesView && this.licensesView.some(i => {
                            if (i.id == data.id) {
                                i.status = "Analisis";
                                return true;
                            }
                        });
                    }, 100)
                } else {
                    console.error("Response", res.status)
                    this.HeaderService.showError("Error al enviar el comprobante!")
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
