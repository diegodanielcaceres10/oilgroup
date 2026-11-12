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

/** Row of provider/getAll: the provider and its account totals (purchases, payments and balance). */
export interface ProviderRow extends Provider {
    buy: number
    payment: number
    pending: number
}

/** Account movement of a provider: a purchase or a payment. */
export interface ProviderMovement {
    id: number
    typeof: 'buy' | 'payment'
    datetime: string
    total: number
    status: string
}

/** Row of the article table (`select * from article`), as listed by provider/find. */
export interface ProviderArticle {
    id: number
    provider: number
    brand: string
    category: string
    code: string
    name: string
    size: string
    variety: string
    stock_code: string
    cost: number
    description: string
    active: number
}

/** Response of provider/find: the provider with its totals, articles and account movements. */
export interface ProviderDetail extends ProviderRow {
    articles: ProviderArticle[]
    buys: ProviderMovement[]
}

/** Body of provider/create. The backend requires the three typed fields. */
export interface ProviderWrite {
    fantasy_name: string
    name: string
    tax_condition: string
    document?: string
    phone?: string
    email?: string
}

/** Body of provider/update: the same fields as create plus the provider id. */
export interface ProviderUpdate extends ProviderWrite {
    id: number
}
