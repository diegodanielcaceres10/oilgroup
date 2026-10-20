/** Row returned by category/getAll: the category name and how many articles use it. */
export interface Category {
    name: string
    count: number
}

/** Body of category/update: rename `name` to `value`. */
export interface CategoryUpdate {
    name: string
    value: string
}
