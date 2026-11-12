import { Provider } from './provider';

/** Row of the provider_payment table. */
export interface ProviderPayment {
    id: number
    provider: number
    ticket: string | null
    method: string
    import: number
    status: string
    datetime: string
}

/** Response of provider_payment/find. `provider` is replaced by the provider row. */
export interface ProviderPaymentDetail extends Omit<ProviderPayment, 'provider'> {
    provider: Provider
}

/** Body of provider_payment/create. The backend requires provider, import and method. */
export interface ProviderPaymentWrite {
    provider: number
    import: number
    method: string
    ticket?: string
}
