/** License state computed by the backend when the session is created. */
export interface SessionLicense {
    month: string
    status: string
    active: number
    days?: number
    expired?: boolean
}

/** Logged-in user, as returned by auth/login and auth/token. */
export interface Session {
    username: string
    lastname: string
    firstname: string
    phone: string
    email: string
    role: string
    type: string
    license: SessionLicense
}

/** Body of auth/login. */
export interface Credentials {
    username: string
    pass: string
}

/**
 * Response of auth/login. A wrong user or password reaches the frontend as
 * `not found`; the other statuses are failures of the request itself.
 */
export type LoginResponse =
    | { status: 'success'; data: Session; token: string }
    | { status: 'login parameters error' | 'not found' | 'query error' | 'error' }

/** Response of auth/token (the token validation done when the page is reloaded). */
export type TokenResponse =
    | { status: 'success'; data: Session }
    | { status: 'not found' | 'query error' | 'error' }
