export interface User {
    id: number,
    name: string,
    email?: string,
    is_paused: boolean,
    expired_at?: string,
    created_at: string,
    updated_at: string,
    permissions: string[],
    token: string,
    tags: string[],
    role: string,
}
