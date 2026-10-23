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
