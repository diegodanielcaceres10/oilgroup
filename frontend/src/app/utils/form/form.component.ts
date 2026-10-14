import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    standalone: false
})
export class FormComponent implements OnInit {

    @Input() form: any
    @Input() saving: boolean
    @Output() submitData = new EventEmitter<any>()

    FormGroup: UntypedFormGroup;
    required: boolean
    selectedInput: string = ""

    constructor() { }

    ngOnInit(): void {
        this.FormGroup = new UntypedFormGroup({});
        if (this.form.groups && this.form.groups.length > 0) {
            this.form.groups.map((group) => {
                group.fields.map((field) => {
                    let validators = []
                    if (field.required) validators.push(Validators.required)
                    if (field.max) validators.push(Validators.max(field.max))
                    if (field.type == "select" && field.id) {
                        this.FormGroup.addControl(field.id, new UntypedFormControl(field.value && field.value[field.nameValue] ? field.value[field.nameValue] : "", validators))
                        if (field.nameLabel) {
                            this.FormGroup.addControl(field.name, new UntypedFormControl({
                                value: field.value && field.value[field.nameLabel] ? field.value[field.nameLabel] : "",
                                disabled: field.disabled,
                            }, validators))
                        } else if (field.namesLabel && field.namesLabel.length > 0) {
                            let values = ""
                            if (field.value) {
                                for (let name of field.namesLabel) {
                                    values += field.value[name] + " "
                                }
                            }
                            this.FormGroup.addControl(field.name, new UntypedFormControl({
                                value: values,
                                disabled: field.disabled,
                            }, validators))
                        }
                    } else if (field.type == "checkbox") {
                        this.FormGroup.addControl(field.name, new UntypedFormControl(field.value ? true : false))
                    } else if (field.type == "file") {
                        this.FormGroup.addControl(field.name, new UntypedFormControl({
                            value: field.value,
                            disabled: field.disabled,
                        }, validators))
                    } else {
                        this.FormGroup.addControl(field.name, new UntypedFormControl({
                            value: field.value,
                            disabled: field.disabled,
                        }, validators))
                    }
                })
            })
            this.form.groups.map((group) => {
                group.fields.map((field) => {
                    this.changed(field)
                })
            })
        }
        
    }

    changed(field) {
        this.required = false
        let value = this.FormGroup.controls[field.name].value
        if (this.form.rules && this.form.rules.length > 0) {
            this.form.rules.map((r) => {
                if (r.name == field.name) {
                    r.names.map((n) => {
                        if (r.type == "required") {
                            this.FormGroup.controls[n].setValidators(r.values.indexOf(value) > - 1 ? [Validators.required] : null)
                            this.FormGroup.controls[n].updateValueAndValidity()
                            this.form.groups.some((g) => {
                                let ok = false
                                g.fields.some((f) => {
                                    if (f.name == n) {
                                        f.required = r.values.indexOf(value) > - 1 ? true : false
                                        ok = true
                                        return true
                                    }
                                })
                                if (ok) return true
                            })
                        } else if (r.type == "disabled") {
                            if (r.values.indexOf(value) > - 1) {
                                this.FormGroup.controls[n].disable()
                            } else {
                                this.FormGroup.controls[n].enable()
                            }
                        } else if (r.type == "enabled") {
                            if (r.values.indexOf(value) > - 1) {
                                this.FormGroup.controls[n].enable()
                            } else {
                                this.FormGroup.controls[n].disable()
                            }
                        } else if (r.type == "text") {
                            this.form.groups.some((g) => {
                                let ok = false
                                g.fields.some((f) => {
                                    if (f.name == n) {
                                        f.type = r.values.indexOf(value) > - 1 ? "text" : "hidden"
                                        ok = true
                                        return true
                                    }
                                })
                                if (ok) return true
                            })
                        } else if (r.type == "date") {
                            this.form.groups.some((g) => {
                                let ok = false
                                g.fields.some((f) => {
                                    if (f.name == n) {
                                        f.type = r.values.indexOf(value) > - 1 ? "date" : "hidden"
                                        ok = true
                                        return true
                                    }
                                })
                                if (ok) return true
                            })
                        }
                    })
                }
            })
        }
        this.form.groups.map((g) => {
            g.fields.map((f) => {
                if (f && f.rules && f.rules.length > 0) {
                }
            })
        })
        if (value && field && field.options && field.options.length > 0 && (field.type == "text" || field.creatable)) {
            field.optionsView = field.options.filter(i => i.toLowerCase().includes(this.FormGroup.controls[field.name].value.toLowerCase()))
        } else {
            field.optionsView = field.options
        }
    }

    selectOption(field, value) {
        if (field.type == "select" && field.id && field.nameLabel) {
            this.FormGroup.controls[field.id].setValue(value[field.nameValue])
            this.FormGroup.controls[field.name].setValue(value[field.nameLabel])
        } else if (field.type == "select" && field.id && field.namesLabel && field.namesLabel.length > 0) {
            let values = ""
            for (let name of field.namesLabel) {
                values += value[name] + " "
            }
            this.FormGroup.controls[field.id].setValue(value[field.nameValue])
            this.FormGroup.controls[field.name].setValue(values)
        } else if (field.type != "select" || !field.id) {
            this.FormGroup.controls[field.name].setValue(value)
        }
    }

    drawFile(files, field) {
        try {
            for (let item of files) {
                const file: File = item;
                if (["application/pdf", "image/png", "image/jpeg", "image/jpg"].indexOf(file.type) == -1) {
                    field.error = "FORMAT";
                    return;
                };
                if (1048576 < file.size) {
                    field.error = "SIZE";
                    return;
                };
                field.value = file;
                this.FormGroup.controls[field.name].setValue(file);
                this.FormGroup.markAllAsTouched();
            };
        } catch (e) {
            console.error("Error", e);
        };
    }

    eventForm(type) {
        if (type == "next") {
            this.required = false
            this.saving = true
            if (this.FormGroup.invalid) {
                this.required = true
                this.saving = false
            } else {
                this.submitData.emit({ values: this.FormGroup.value, event: this.form.event })
            }
        } else if (type != "submit") {
            this.required = false
            this.saving = true
            this.submitData.emit({ values: null, event: type })
        }
    }

    submitForm() {
        this.required = false
        this.saving = true
        if (this.FormGroup.invalid) {
            this.required = true
            this.saving = false
        } else if (this.FormGroup.touched) {
            this.submitData.emit({ values: this.FormGroup.value, event: this.form.event })
        } else {
            this.submitData.emit(false)
        }
    }
}
