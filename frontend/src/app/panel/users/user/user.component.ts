import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../_shared/service/user.service';
import { NavService } from '../../../_shared/service/nav.service';
import { HeaderService } from '../../../_shared/service/header.service';
import { LoadService } from '../../../_shared/service/load.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserComponent implements OnInit, OnDestroy {

    paging!: boolean
    editMode!: boolean
    createMode!: boolean
    user: any = {
        sales: [],
    }
    salesFiltered: any = []
    salesView: any = []
    page = 1
    pages = 1
    maxitems = 20
    roles: any = ["Administrador", "Vendedor"]
    dialogs: any = []
    form: any = {}
    suscription: any

    constructor(
        private ActivatedRoute: ActivatedRoute,
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
            const path = this.ActivatedRoute.snapshot.url[0].path
            if (path == "nuevo") {
                setTimeout(() => {
                    this.createMode = true
                    this.getData()
                }, 100)
            } else {
                const username = this.ActivatedRoute.snapshot.params["username"]
                this.page = parseInt(this.ActivatedRoute.snapshot.params["page"])
                this.find(username)
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

    find(username: any) {
        try {
            this.LoadService.change(true)
            this.UserService.find({ user: { username: username } }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.user = res.data
                        this.salesFiltered = this.user.sales
                        this.LoadService.change(false)
                        this.getData()
                        this.changePage(this.page)
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar el usuario!")
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
            this.form = {
                title: this.createMode ? "Nuevo usuario. Datos obligatorios *" : "Editar usuario. Datos obligatorios *",
                event: this.createMode ? "createUserDialogConfirm" : "updateUserDialogConfirm",
                groups: [
                    {
                        fields: [
                            {
                                name: "username",
                                type: "hidden",
                                value: this.user.username,
                            },
                            {
                                name: "usernameText",
                                type: "text",
                                label: "Nombre de usuario",
                                value: this.user.username,
                                disabled: true,
                            },
                            {
                                name: "lastname",
                                type: "text",
                                label: "Apellido",
                                value: this.user.lastname,
                                required: true,
                            },
                            {
                                name: "firstname",
                                type: "text",
                                label: "Nombre",
                                value: this.user.firstname,
                                required: true,
                            },
                            {
                                name: "phone",
                                type: "text",
                                label: "Teléfono",
                                value: this.user.phone,
                            },
                            {
                                name: "email",
                                type: "text",
                                label: "Correo electrónico ",
                                value: this.user.email,
                            },
                            {
                                name: "role",
                                type: "select",
                                options: this.roles,
                                label: "Permiso",
                                value: this.user.role,
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
            }
            this.LoadService.change(false)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    changePage(value: any) {
        try {
            this.paging = true
            this.salesView = []
            this.pages = Math.ceil(this.salesFiltered.length / this.maxitems)
            this.page = value > this.pages ? 1 : value
            this.Location.replaceState("/panel/usuarios/" + this.user.username + "/" + this.page)
            const list = this.salesFiltered.slice(this.maxitems * (this.page - 1), this.maxitems * this.page)
            setTimeout(() => {
                this.paging = false
                this.salesView = list
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    sendForm(data: any) {
        try {
            if (data) {
                if (data.event == "createUserDialogConfirm") {
                    this.createUserDialogConfirm(data.values)
                } else if (data.event == "updateUserDialogConfirm") {
                    this.updateUserDialogConfirm(data.values)
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
    createUserDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Crear usuario",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "createUser",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    updateUserDialogConfirm(data: any) {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Actualizar usuario",
                message: "¿Estas seguro de continuar?",
                values: data,
                event: "updateUser",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    resetUserDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Resetear clave de usuario",
                message: "¿Estas seguro de continuar?",
                event: "resetUser",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    printSummaryDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Generar resúmen de cuentas",
                message: "¿Estas seguro de continuar?",
                event: "printSummary",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    printPendingDialogConfirm() {
        try {
            this.dialogs.push({
                type: "confirm",
                title: "Generar resúmen de remitos pendientes",
                message: "¿Estas seguro de continuar?",
                event: "printPending",
            })
        } catch (e) {
            console.error("Error", e)
        }
    }

    // Define response dialog events
    responseDialog(data: any) {
        try {
            if (data) {
                if (data.event == "createUser") {
                    this.createUser(data.values)
                } else if (data.event == "updateUser") {
                    this.updateUser(data.values)
                } else if (data.event == "resetUser") {
                    this.resetUser()
                } else if (data.event == "printSummary") {
                    this.printSummary()
                } else if (data.event == "printPending") {
                    this.printPending()
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
    createUser(data: any) {
        try {
            this.UserService.create({ user: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.createMode = false
                        const username = data.firstname.replace(/'| /gi, "").toLowerCase() + data.lastname.replace(/'| /gi, "").toLowerCase()
                        this.find(username)
                        this.Location.replaceState("/panel/usuarios/" + username + "/1")
                        this.HeaderService.showSuccess("Usuario creado con exito. La clave de acceso es " + res.data)
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al crear el usuario!")
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

    updateUser(data: any) {
        try {
            this.UserService.update({ user: data }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.editMode = false
                        this.find(data.username)
                        this.HeaderService.showSuccess("Usuario actualizado con exito")
                        this.dialogs = []
                    }, 100)
                } else if (res.status == "duplicate") {
                    setTimeout(() => {
                        this.HeaderService.showError("Ya existe un registro con esos datos!")
                        this.dialogs.pop()
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

    resetUser() {
        try {
            const user = { ...this.user }
            this.UserService.reset({ user: user }).then((res: any) => {
                if (res.status == "success") {
                    setTimeout(() => {
                        this.find(user.username)
                        this.HeaderService.showSuccess("Usuario reseteado con exito. La nueva clave de acceso es " + res.data)
                        this.dialogs = []
                    }, 100)
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al resetear el usuario!")
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

    printSummary() {
        try {
            const user = { ...this.user }
            this.UserService.summary({ user: user, }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
            this.suscription = this.UserService.progress.subscribe({
                next: (data: any) => {
                    if (data.body && data.status) {
                        const blob: any = new Blob([data.body], { type: 'application/pdf' });
                        const objectUrl = URL.createObjectURL(blob);
                        window.open(objectUrl, '_blank');
                        this.dialogs = []
                        this.suscription.unsubscribe();
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

    printPending() {
        try {
            const user = { ...this.user }
            this.UserService.pending({ user: user, }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.dialogs.pop()
            })
            this.suscription = this.UserService.progress.subscribe({
                next: (data: any) => {
                    if (data.body && data.status) {
                        const blob: any = new Blob([data.body], { type: 'application/pdf' });
                        const objectUrl = URL.createObjectURL(blob);
                        window.open(objectUrl, '_blank');
                        this.dialogs = []
                        this.suscription.unsubscribe();
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
