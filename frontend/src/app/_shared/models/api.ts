/**
 * Response body sent by the backend. `status` is the discriminator:
 * - success: the request worked. `data` is present only on endpoints that return rows.
 * - duplicate: the row already exists (sent with HTTP 200 by `exists_row`).
 * - error: controller failure (HTTP 500).
 * - invalid, not found, query error: failures reported by the storage module.
 */
export type ApiResponse<T = undefined> =
    | { status: 'success'; data: T }
    | { status: 'duplicate' }
    | { status: 'error'; error: string }
    | { status: 'invalid' | 'not found' | 'query error' }
