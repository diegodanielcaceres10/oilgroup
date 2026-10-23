import { User } from './user';

/** Row of the customer table. */
export interface Customer {
    id: number
    user: string
    fantasy_name: string
    document: string
    name: string
    phone: string
    email: string
    tax_condition: string
    address: string
    city: string
    schedule: string
    active: number
}

/**
 * Row of customer/getAll: the customer, the name of the user in charge (null
 * when there is none) and the account totals.
 */
export interface CustomerRow {
    id: number
    fantasy_name: string
    name: string
    lastname: string | null
    firstname: string | null
    active: number
    sale: number
    success: number
    billing: number
    payment: number
    pending: number
}

/** Account movement of a customer: a sale or a payment. */
export interface CustomerMovement {
    id: number
    typeof: 'sale' | 'payment'
    datetime: string
    total: number
    billing: number
    billing_date: string | null
    status: string
}

/** Response of customer/find. `user` is replaced by the user row when the customer has one. */
export interface CustomerDetail extends Omit<Customer, 'user'> {
    user: User | '' | undefined
    sale: number
    success: number
    billing: number
    payment: number
    pending: number
    sales: CustomerMovement[]
}

/** Body of customer/create. The backend requires the four typed fields. */
export interface CustomerWrite {
    user: string
    fantasy_name: string
    name: string
    tax_condition: string
    document?: string
    phone?: string
    email?: string
    address?: string
    city?: string
    schedule?: string
}

/** Body of customer/update: the same fields as create plus the customer id. */
export interface CustomerUpdate extends CustomerWrite {
    id: number
}
