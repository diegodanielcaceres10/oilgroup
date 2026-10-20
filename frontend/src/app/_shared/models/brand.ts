/** Row returned by brand/getAll: the brand name and how many articles use it. */
export interface Brand {
    name: string
    count: number
}

/** Body of brand/update: rename `name` to `value`. */
export interface BrandUpdate {
    name: string
    value: string
}
