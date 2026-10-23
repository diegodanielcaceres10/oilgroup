import { FormField } from './dialog';

/** Filter as the backend reads it: name, parent, type, value, id, nameValue and searchFields. */
export interface ApiFilter {
    name: string
    parent?: string | null
    type?: string
    value?: any
    id?: string
    nameValue?: string
    searchFields?: string[]
}

/** Filter shown in the UI: it is also rendered as a form field. */
interface FilterBase extends FormField {
    parent?: string
    searchFields?: string[]
}

/** Filter that is sent to the backend but not shown, so it may have no label. */
export interface HiddenFilter extends FilterBase {
    type: 'hidden'
    label: string | null
    id?: undefined
    nameValue?: undefined
    nameLabel?: undefined
}

/** Visible filter whose value is typed in by the user or chosen from fixed options. */
export interface PlainFilter extends FilterBase {
    type: 'text' | 'date' | 'select'
    label: string
    id?: undefined
    nameValue?: undefined
    nameLabel?: undefined
}

/**
 * Select filter backed by a lookup column (`id`). Its value is an object read
 * through `nameValue` and `nameLabel`.
 */
export interface LookupFilter extends FilterBase {
    type: 'select'
    label: string
    id: string
    nameValue: string
    nameLabel: string
}

export type Filter = HiddenFilter | PlainFilter | LookupFilter
