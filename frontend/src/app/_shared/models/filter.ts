import { FormField } from './dialog';

/** Filter as the backend reads it: name, parent, type, value, id, nameValue and searchFields. */
export interface ApiFilter {
    name: string
    parent?: string
    type?: string
    value?: any
    id?: string
    nameValue?: string
    searchFields?: string[]
}

/** Filter shown in the UI: it is also rendered as a form field, so it needs a label. */
interface FilterBase extends FormField {
    label: string
    parent?: string
    searchFields?: string[]
}

/** Filter whose value is typed in by the user. */
export interface PlainFilter extends FilterBase {
    id?: undefined
    nameValue?: undefined
    nameLabel?: undefined
}

/**
 * Select filter backed by a lookup column (`id`). Its value is an object read
 * through `nameValue` and `nameLabel`.
 */
export interface LookupFilter extends FilterBase {
    id: string
    nameValue: string
    nameLabel: string
}

export type Filter = PlainFilter | LookupFilter
