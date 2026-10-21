import { Provider } from './provider';

/** Row of article/getAll and article/exportStock. `stock` is the computed balance. */
export interface ArticleRow {
    id: number
    provider: number
    fantasy_name: string
    brand: string
    category: string
    code: string
    name: string
    size: string
    variety: string
    stock: number
    active: number
}

/** Row of the price table. */
export interface Price {
    id: number
    article: number
    units: number
    measure: string
    price_list: number | null
    price_offer: number | null
}

/** Row of article/getAllPrices: one price (a measure of an article) with its article data. */
export interface PriceRow {
    id: number
    article: number
    provider: number
    fantasy_name: string
    code: string
    brand: string
    name: string
    cost: number
    size: string
    variety: string
    measure: string
    units: number
    price_list: number | null
    price_offer: number | null
}

/** Row of article/getPrices: the price list used when selling, with the stock of each article. */
export interface PriceListRow {
    id: number
    fantasy_name: string
    brand: string
    code: string
    name: string
    size: string
    variety: string
    measure: string
    units: number
    price_list: number | null
    price_offer: number | null
    stock: number
}

/** Stock movement of an article: adjustments, purchases and sales. */
export interface ArticleHistory {
    typeof: string
    description: string | null
    datetime: string
    units: number
}

export interface ArticleSale {
    sale: number
    datetime: string
    quantity: number | null
    measure: string | null
    price: number | null
    subtotal: number
    fantasy_name: string
}

export interface ArticleProfitability {
    item: string
    total: number
}

/** Response of article/find. `provider` is replaced by the provider row. */
export interface ArticleDetail {
    id: number
    provider: Provider
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
    required: number
    stock: number
    prices: Price[]
    history: ArticleHistory[]
    sales: ArticleSale[]
    profitability: ArticleProfitability[]
}

/** Body of article/create. The backend requires the typed fields; size, variety, cost and description are optional. */
export interface ArticleWrite {
    provider: number
    brand: string
    category: string
    code: string
    name: string
    stock_code: string
    size?: string
    variety?: string
    cost?: number | string
    description?: string
}

/** Body of article/update: the same fields as create plus the article id. */
export interface ArticleUpdate extends ArticleWrite {
    id: number
}

/** Body of article/addMeasure. */
export interface MeasureAdd {
    article: number
    measure: string
    units: number
}

/** Body of article/updateMeasure. */
export interface MeasureUpdate {
    id: number
    article: number
    measure: string
    units: number
}

/** Body of article/deleteMeasure. */
export interface MeasureDelete {
    id: number
}

/** Body of article/updatePrices. An empty price is sent as false. */
export interface PriceUpdate {
    id: number
    price_list: number | false
    price_offer: number | false
}

/** Body of article/updateStock: adjust the stock of an article by `units`. */
export interface StockAdjustment {
    id: number
    units: number
    description: string
}
