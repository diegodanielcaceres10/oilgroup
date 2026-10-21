/** Field rendered by the form dialog. Filters are also rendered as form fields. */
export interface FormField {
    name: string
    type: string
    label?: string
    value?: any
    required?: boolean
    disabled?: boolean
    creatable?: boolean
    symbol?: string
    id?: string
    options?: any[]
    nameValue?: string
    nameLabel?: string
}

export interface DialogButton {
    icon: string
    text: string
    type: string
    primary?: boolean
}

export interface DialogGroup {
    fields: FormField[]
}

export interface DialogForm {
    full: boolean
    title?: string
    event: string
    groups: DialogGroup[]
    buttons: DialogButton[]
}

export interface Dialog {
    type: 'confirm' | 'form' | 'list'
    title: string
    message?: string
    event?: string
    values?: any
    span?: string
    form?: DialogForm
}

/** Event emitted by the dialog modal back to the page that opened it. */
export interface DialogResponse {
    event: string
    values: any
}
