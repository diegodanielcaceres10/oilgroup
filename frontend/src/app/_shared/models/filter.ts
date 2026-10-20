import { FormField } from './dialog';

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
 * through `nameValue` and `nameLabel`. The backend reads name, parent, type,
 * value, id, nameValue and searchFields.
 */
export interface LookupFilter extends FilterBase {
    id: string
    nameValue: string
    nameLabel: string
}

export type Filter = PlainFilter | LookupFilter
