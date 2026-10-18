import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_shared/service/auth.service';
import { LoadService } from '../_shared/service/load.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LoginComponent implements OnInit {

    loading = true
    saving!: boolean
    error!: string
    form: any = {}

    constructor(
        private Router: Router,
        private AuthService: AuthService,
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

    login(data: any) {
        try {
            this.saving = true
            this.AuthService.logIn(data.values).then((res: any) => {
                setTimeout(() => {
                    if (res == "success") {
                        this.Router.navigateByUrl("panel");
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
