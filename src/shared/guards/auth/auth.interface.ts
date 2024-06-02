export interface User {
    name: string;
    email: string;
    profile?: string;
    permissions?: string[];
}

export interface Auth {
    user: User;
    token?: string;
    expires?: Date;
}