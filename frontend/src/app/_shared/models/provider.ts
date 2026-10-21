/** Row of the provider table, as returned by `select * from provider`. */
export interface Provider {
    id: number
    fantasy_name: string
    document: string
    name: string
    phone: string
    email: string
    tax_condition: string
    active: number
}
