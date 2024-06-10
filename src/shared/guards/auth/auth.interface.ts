export interface User {
    id: string;
    name: string;
    email: string;
    permissions?: string[];
}

export interface Auth {
    user: User;
    token?: string;
    expires_in?: Date;
}