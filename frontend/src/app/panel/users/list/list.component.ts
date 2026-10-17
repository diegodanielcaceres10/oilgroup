import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_shared/service/auth.service';
import { UserService } from '../../../_shared/service/user.service';
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
    users: any = []
    usersFiltered: any = []
    usersView: any = []
    page: number = 1
    pages: number = 1
    roles: any = ["Administrador", "Vendedor"]
    maxitems: number = 20
    filters: any = []
    dialogs: any = []

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private AuthService: AuthService,
        private UserService: UserService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
        private Location: Location,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "user", subpage: "users" })
            }, 0)
            this.access = this.AuthService.getUser()
            this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
            let params = this.ActivatedRoute.snapshot.queryParams
            this.filters = [
                {
                    name: "username",
                    type: "text",
                    label: "usuario",
                    value: params["usuario"] || "",
                },
                {
                    name: "lastname",
                    type: "text",
                    label: "Apellido",
                    value: params["apellido"] || "",
                },
                {
                    name: "firstname",
                    type: "text",
                    label: "Nombre",
                    value: params["nombre"] || "",
                },
                {
                    name: "phone",
                    type: "text",
                    label: "Teléfono",
                    value: params["teléfono"] || "",
                },
                {
                    name: "email",
                    type: "text",
                    label: "Correo electrónico ",
                    value: params["correoelectrónico"] || "",
                },
                {
                    name: "role",
                    type: "select",
                    options: this.roles,
                    label: "Permiso",
                    value: params["permiso"] || "",
                },
                {
                    name: "status",
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
            this.usersFiltered = []
            this.usersView = []
            this.page = page
            this.UserService.getAll({ filter: this.filters }).then((res: any) => {
                if (res.status == "success") {
                    this.users = res.data;
                    this.usersFiltered = res.data;
                    this.pages = Math.ceil(this.usersFiltered.length / this.maxitems);
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
            this.usersView = []
            this.page = value > this.pages ? 1 : value
            let params = ""
            for (let filter of this.filters) {
                if (filter.type != "hidden" && filter.id && filter.value && filter.value[filter.nameLabel] && filter.value[filter.nameLabel] != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel] : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value[filter.nameLabel];
                } else if (filter.type != "hidden" && !filter.id && filter.value && filter.value != "") {
                    params += params == "" ? "?" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value : "&" + filter.label.replace(/ /gi, "").toLowerCase() + "=" + filter.value;
                }
            }
            this.Location.replaceState("/panel/usuarios/" + this.page + params)
            let list = this.usersFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.LoadService.change(false)
                this.usersView = list
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

    activeUserDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Editar usuario",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "activeUser",
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
                } else if (data.event == "activeUser") {
                    this.activeUser(data.values)
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

    activeUser(data: any) {
        try {
            this.UserService.active({ user: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.getAll(1)
                        this.HeaderService.showSuccess("Usuario actualizado con exito")
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al actualizar el usuario!")
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
