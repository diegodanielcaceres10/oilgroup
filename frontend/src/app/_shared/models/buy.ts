import { Provider } from './provider';

/** Row of the buy table: a purchase from a provider. */
export interface Buy {
    id: number
    provider: number
    ticket: string | null
    description: string | null
    total: number
    status: string
    datetime: string
}

/** Row of the buy_detail table: an article or a free-text concept of a purchase. */
export interface BuyLine {
    id: number
    buy: number
    article: number | null
    concept: string | null
    cost: number | null
    quantity: number | null
    units: number | null
    subtotal: number
}

/** Line of buy/find: the buy_detail row plus the brand and name of its article. */
export interface BuyItem extends BuyLine {
    brand: string | null
    name: string | null
}

/** Response of buy/find. `provider` is replaced by the provider row. */
export interface BuyDetail extends Omit<Buy, 'provider'> {
    provider: Provider
    items: BuyItem[]
}

/** Article line sent to buy/create. */
export interface BuyArticle {
    id: number
    cost: number
    quantity: number
    units: number
    subtotal: number
}

/** Free-text concept line sent to buy/create. */
export interface BuyConcept {
    concept: string
    subtotal: number
}

/** Body of buy/create. When `payment.status` is set the backend also registers the payment. */
export interface BuyCreate {
    provider: { id: number }
    total: number
    ticket: string
    description: string
    articles: BuyArticle[]
    details: BuyConcept[]
    payment: {
        status: boolean
        import: number
        method: string
        ticket: string
    }
}
