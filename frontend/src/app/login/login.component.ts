import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_shared/service/user.service';
import { LoadService } from '../_shared/service/load.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    loading: boolean = true
    saving: boolean
    error: string
    form: any = {}

    constructor(
        private Router: Router,
        private UserService: UserService,
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            this.form = {
                full: true,
                event: "login",
                groups: [
                    {
                        fields: [
                            {
                                name: "username",
                                type: "text",
                                symbol: "fas fa-user",
                                label: "Nombre de usuario",
                                required: true,
                            },
                            {
                                name: "pass",
                                type: "password",
                                symbol: "fas fa-key",
                                label: "Contraseña",
                                required: true,
                            },
                        ],
                    },
                ],
                buttons: [
                    {
                        icon: "fas fa-check-circle",
                        text: "INGRESAR",
                        type: "submit",
                        primary: true,
                        saving: true,
                    },
                ],
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    load() {
        try {
            setTimeout(() => {
                this.LoadService.change(false)
                this.loading = false
            }, 1000)
        } catch (e) {
            console.error("Error", e)
        }
    }

    login(data) {
        try {
            this.saving = true
            this.UserService.logIn(data.values).then((res: any) => {
                setTimeout(() => {
                    if (res == "success") {
                        this.Router.navigateByUrl("panel")
                    } else if (res == "not found") {
                        this.saving = false
                        this.error = "Los datos son incorrectos"
                    } else {
                        console.error("Response:", res)
                        this.saving = false
                        this.error = "Error en la respuesta"
                    }
                }, 100)
            }).catch((e) => {
                console.error("Error", e)
                this.saving = false
                this.error = "Error la conectividad"
            })
        } catch (e) {
            console.error("Error", e)
            this.saving = false
            this.error = "Error en el inicio de sesión"
        }
    }

}
