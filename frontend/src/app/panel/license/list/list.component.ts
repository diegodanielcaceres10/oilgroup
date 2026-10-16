import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_shared/service/auth.service';
import { LicenseService } from '../../../_shared/service/license.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import moment from 'moment';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListComponent implements OnInit {

    access: any = {}
    paging: boolean
    licenses: any = []
    licensesFiltered: any = []
    licensesView: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20
    dialogs: any = []
    priceCoefficientValidate: number = environment.priceCoefficientValidate;

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private AuthService: AuthService,
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
            this.access = this.AuthService.getUser();
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"]);
            this.getAll(this.page)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false);
        }
    }

    getAll(page: number) {
        try {
            this.paging = true
            this.licensesFiltered = []
            this.licensesView = []
            this.page = page
            this.LicenseService.getAll({}).then((res: any) => {
                if (res.status == "success") {
                    this.licenses = res.data
                    this.licensesFiltered = res.data
                    let current = this.licensesFiltered && this.licensesFiltered.find((i: any) => i.current);
                    if (current) {
                        if (current.coefficient_validate) {
                            let validatetime = current.coefficient_validate && moment(current.coefficient_validate).format("YYYY-MM-DD, HH:mm:ss");
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
                    console.error("Response:", res.status)
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

    changePage(value: any) {
        try {
            this.paging = true
            this.licensesView = []
            this.page = value > this.pages ? 1 : value
            this.Location.replaceState("/panel/licencia/" + this.page)
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
    setPriceDialogConfirm(data: any) {
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

    uploadTicketDialogForm(data: any) {
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

    uploadTicketDialogConfirm(data: any) {
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
    responseDialog(data: any) {
        try {
            if (data) {
                if (data.event == "getAll") {
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

    calcDollar(data: any) {
        try {
            data.loading = true;
            this.LicenseService.getDollar().then((res: any) => {
                data.coefficient = res;
                data.coefficient_date = moment();
                data.coefficient_validate = moment().add(this.priceCoefficientValidate, "hours");
                data.calc = true;
                data.loading = false;
                setTimeout(() => {
                    if (data.calc) {
                        data.calc = false;
                        data.coefficient_validate = undefined;
                    }
                }, (1000 * 60 * 1));
            }).catch((e) => {
                console.error("Error", e);
                this.HeaderService.showError("Error al calcular la cotización");
            })
        } catch (e) {
            console.error("Error", e);
        }
    }

    setPrice(data: any) {
        try {
            this.LicenseService.price({ license: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.HeaderService.showSuccess("Cotización reservada con exito. Deberá adjuntar el comprobante durante las proximas " + this.priceCoefficientValidate + " horas");
                        this.dialogs.pop();
                        data.calc = false;
                        let validatetime = moment(data.coefficient_validate).format("YYYY-MM-DD, HH:mm:ss");
                        const timeout = moment(validatetime).diff(moment());
                        this.removePrice(data, timeout + (1000 * 60));
                    }, 100);
                } else {
                    console.error("Response:", res.status);
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

    removePrice(data: any, timeout: any) {
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
                        console.error("Response:", res.status);
                    }
                }).catch((e) => {
                    console.error("Error", e);
                });
            }, timeout);
        } catch (e) {
            console.error("Error", e);
        }
    }

    uploadTicket(data: any) {
        try {
            this.LicenseService.upload(data).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.HeaderService.showSuccess("Comprobante adjunto con exito.");
                        this.dialogs = [];
                        this.licensesView && this.licensesView.some((i: any) => {
                            if (i.id == data.id) {
                                i.status = "Analisis";
                                return true;
                            }
                        });
                    }, 100)
                } else {
                    console.error("Response:", res.status)
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
