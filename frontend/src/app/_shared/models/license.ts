/** Row of the license table: one month of the system license. */
export interface License {
    id: number
    month: string
    value: number
    coefficient: number | null
    coefficient_date: string | null
    coefficient_validate: string | null
    total: number
    datetime: string | null
    current: number
    status: string
}

/** Row of license/getAll: the license plus the amount already paid and approved. */
export interface LicenseRow extends License {
    payments: number
}

/** Row of the license_item table: a charge added to a license. */
export interface LicenseItem {
    id: number
    license: number
    name: string
    value: number
}

/** Row of the license_payment table. `link` is the uploaded receipt. */
export interface LicensePayment {
    id: number
    license: number
    link: string | null
    total: number
    payment_date: string | null
    status: string
    datetime: string
}

/** Response of license/find: the license with its charges, payments and the approved total. */
export interface LicenseDetail extends License {
    totalpayments: number
    items: LicenseItem[]
    payments: LicensePayment[]
}

/** Body of license/price: sets the dollar coefficient and how long it stays valid. */
export interface LicensePriceUpdate {
    id: number
    coefficient: number
    coefficient_date: string
    coefficient_validate: string
}

/** Body of license/payment: approves a payment made on `date` at `time`. */
export interface LicensePaymentApproval {
    id: number
    license: number
    total: number
    date: string
    time: string
}

/** Body of license/upload (multipart): the receipt file `ticket` for license `id`. */
export interface LicenseUpload {
    id: number
    ticket: File
}

/** Response of license/remove: `remove` is true when the stored coefficient was cleared. */
export type LicenseRemoveResponse =
    | { status: 'success'; remove?: true }
    | { status: 'error'; error: string }
    | { status: 'invalid' | 'not found' | 'query error' }

/** Fragment of the bluelytics response that the app reads. */
export interface DollarQuote {
    blue?: { value_sell?: number }
}
