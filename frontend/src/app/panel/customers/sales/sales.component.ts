import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../_shared/service/user.service';
import { SaleService } from '../../../_shared/service/sale.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
})
export class SalesComponent implements OnInit {

    access: any = {}
    paging: boolean
    path: string = ""
    filter: any = {
        "pendientes": "pending",
        "listas": "ready",
        "facturacion": "billing",
    }
    filters: any = []
    sales: any = []
    salesView: any = []
    page: number = 1
    pages: number = 1
    maxitems: number = 20

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private UserService: UserService,
        private SaleService: SaleService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "customer", subpage: this.filter[this.path] })
            }, 0)
            this.access = this.UserService.getUser()
            this.path = this.ActivatedRoute.snapshot.url[1].path
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            this.LoadService.change(true)
            let filter = this.filters
            if (this.path == "facturacion") {
                filter.push({ name: "billing", value: 1 }, { name: "billing_date", type: "null", value: "null" })
            } else if (this.path == "pendientes") {
                filter.push({ name: "status", value: "Pendiente" })
            } else if (this.path == "listas") {
                filter.push({ name: "status", value: "Lista" })
            }
            if (["Super Administrador", "Administrador"].indexOf(this.access.role) == -1) {
                filter.push({ name: "user", parent: "s", value: this.access.username })
            }
            this.SaleService.getAll({ filter: filter }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.sales = res.data
                        this.changePage(this.page)
                        this.LoadService.change(false)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar las metricas!")
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

    changePage(value) {
        try {
            this.paging = true
            this.salesView = []
            this.pages = Math.ceil(this.sales.length / this.maxitems)
            this.page = value > this.pages ? 1 : value
            this.Location.replaceState("/panel/clientes/ventas/" + this.path + "/" + this.page)
            let list = this.sales.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.salesView = list
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.paging = false
            this.LoadService.change(false)
        }
    }

}
