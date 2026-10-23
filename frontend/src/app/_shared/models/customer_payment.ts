import { Customer } from './customer';

/** Row of the customer_payment table. */
export interface CustomerPayment {
    id: number
    user: string
    customer: number
    ticket: string
    method: string
    import: number
    account_name: string
    account_bank: string
    number: string
    cashing_date: string | null
    status: string
    datetime: string
}

/** Response of customer_payment/find. `customer` is replaced by the customer row. */
export interface CustomerPaymentDetail extends Omit<CustomerPayment, 'customer'> {
    customer: Customer
}

/** Body of customer_payment/create. The backend requires customer, import and method. */
export interface CustomerPaymentWrite {
    customer: number
    import: number
    method: string
    ticket?: string
    account_name?: string
    account_bank?: string
    number?: string
    cashing_date?: string
}
