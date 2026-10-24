/**
 * Row of the user table. Note that the backend returns the whole row,
 * including `pass` (the password hash), wherever it uses `select * from user`.
 */
export interface User {
    username: string
    pass: string
    lastname: string
    firstname: string
    phone: string
    email: string
    role: string
    type: string
    active: number
}

/** Row of user/getAll and user/summary: the user without its password hash. */
export type UserRow = Omit<User, 'pass'>

/** Sale made by a user, as listed by user/find. `fantasy_name` is null for sales without a customer. */
export interface UserSale {
    id: number
    datetime: string
    fantasy_name: string | null
    total: number
    status: string
}

/** Response of user/find: the user row plus the sales made by that user. */
export interface UserDetail extends UserRow {
    sales: UserSale[]
}

/** Identifies a user in find, active, reset, summary and pending. */
export interface UserKey {
    username: string
}

/** Body of user/create. The backend builds the username from firstname and lastname. */
export interface UserWrite {
    firstname: string
    lastname: string
    role: 'Administrador' | 'Vendedor'
    phone?: string
    email?: string
}

/** Body of user/update: the same fields as create plus the username. */
export interface UserUpdate extends UserWrite {
    username: string
}
