export interface User {
    id: string;
    name: string;
    email: string;
    permissions: string[];
    username: string;
    password: string;
}

export interface Auth {
    user: User;
    token: string;
    expires_in: number;
    last_updated: Date;
    connection_flag: boolean;
}