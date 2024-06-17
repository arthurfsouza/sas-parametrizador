import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval } from "rxjs";
import { addSeconds } from 'date-fns';
import { DataStorage, LocalStorageService } from "../../services";
import { Auth } from "./auth.interface";
import { api } from "../../configurations";

@Injectable({providedIn: 'root'})
export class AuthService {
    private _http = inject(HttpClient);
    private _localStorage = inject(LocalStorageService);

    private _auth!: Auth;

    constructor() {
        this._localStorage.getStorage().subscribe((dataStorage: DataStorage) => {
            if(dataStorage?.type == "auth") { this._auth = dataStorage?.data; }
        });
    }

    public initSchedule(): void {
        this._auth = this._localStorage.getStorageData("auth");

        if(this._auth && this._auth.connection_flag) {
            const source = interval(1000 * 60 * 5); // A cada 5 minutos

            source.subscribe((val) => {
                const now: Date = new Date();
                const lastUpdated: Date = new Date(this._auth.last_updated);
                const expiresIn: Date = addSeconds(lastUpdated, (this._auth.expires_in - 600));

                if(now.getTime() >= expiresIn.getTime()) {
                    this._auth = this._refreshToken(this._auth);
                }
            });
        }
    }

    public logout(): void {
        if(this._auth) {
            this._localStorage.storageData({ type: 'auth', data: null });
            window.location.reload();
        }
    }

    private _refreshToken(auth: Auth): Auth {
        const body: any = { username: auth.user.username, password: auth.user.password };      

        this._http.post(api.private.login, body).subscribe(
            (response: any) => {
                if(response) {
                    auth = {
                        token: response.token,
                        expires_in: response.expires_in,
                        last_updated: new Date(),
                        connection_flag: true,
                        user: {
                            id: response.user_id,
                            name: response.user_name,
                            email: response.user_email,
                            permissions: response.santander_memberships_ids,
                            username: body.username,
                            password: body.password
                        }
                    };

                    this._localStorage.storageData({ type: 'auth', data: auth });
                }
            }
        );

        return auth;
    }
}