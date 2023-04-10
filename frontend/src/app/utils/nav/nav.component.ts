import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../_shared/service/user.service';
import { NavService } from 'src/app/_shared/service/nav.service';
import { LoadService } from '../../_shared/service/load.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {

    @ViewChild("logo") logo: ElementRef;
    access: any = {}
    items: any = [
        {
            name: "home",
            icon: "fas fa-th-large",
            label: "Inicio",
            link: "/panel",
        },
        {
            name: "article",
            icon: "fas fa-box",
            label: "Articulos",
            subs: [
                {
                    access: ["Super Administrador", "Administrador"],
                    name: "articles",
                    link: "/panel/articulos/1",
                    icon: "fas fa-box-open",
                    label: "Articulos",
                },
                {
                    name: "prices",
                    link: "/panel/articulos/precios/1",
                    icon: "fas fa-dollar-sign",
                    label: "Precios",
                },
                {
                    name: "stock",
                    link: "/panel/articulos/stock/1",
                    icon: "fas fa-tasks",
                    label: "Stock",
                },
                {
                    access: ["Super Administrador", "Administrador"],
                    name: "brands",
                    link: "/panel/articulos/marcas/1",
                    icon: "fas fa-star",
                    label: "Marcas",
                },
                {
                    access: ["Super Administrador", "Administrador"],
                    name: "categories",
                    link: "/panel/articulos/categorias/1",
                    icon: "fas fa-tag",
                    label: "Categorías",
                },
            ],
        },
        {
            name: "customer",
            icon: "fas fa-user-tie",
            label: "Clientes",
            subs: [
                {
                    name: "customers",
                    link: "/panel/clientes/1",
                    icon: "fas fa-user-friends",
                    label: "Clientes",
                },
                {
                    name: "pending",
                    link: "/panel/clientes/ventas/pendientes/1",
                    icon: "fas fa-thumbtack",
                    label: "Ventas Pendientes",
                },
                {
                    name: "ready",
                    link: "/panel/clientes/ventas/listas/1",
                    icon: "fas fa-bell",
                    label: "Ventas Listas",
                },
                {
                    access: ["Super Administrador", "Administrador"],
                    name: "billing",
                    link: "/panel/clientes/ventas/facturacion/1",
                    icon: "fas fa-bell",
                    label: "Facturas Pendientes",
                },
            ],
        },
        {
            access: ["Super Administrador", "Administrador"],
            name: "provider",
            icon: "fas fa-truck",
            label: "Proveedores",
            link: "/panel/proveedores/1",
        },
        {
            access: ["Super Administrador"],
            name: "user",
            icon: "fas fa-user-shield",
            label: "Usuarios",
            link: "/panel/usuarios/1",
        },
    ]
    menuselected: string = ""
    pageselected: string = ""

    constructor(
        private Router: Router,
        private UserService: UserService,
        private NavService: NavService,
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        try {
            this.NavService.pageSelected.subscribe(data => {
                this.menuselected = data.page
                this.pageselected = data.subpage
            })
            this.access = this.UserService.getUser()
        } catch (e) {
            console.error("Error", e)
        }
    }

    redirect(link, name, subname) {
        try {
            this.menuselected = name
            this.pageselected = subname
            if (this.menuselected != name || this.pageselected != subname) this.LoadService.change(true)
            this.Router.navigateByUrl(link);
            this.logo && this.logo.nativeElement && this.logo.nativeElement.focus()
        } catch (e) {
            console.error("Error", e)
        }
    }

}
