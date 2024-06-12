import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval } from "rxjs";
import { subMinutes } from 'date-fns';
import { LocalStorageService } from "../../services";
import { Auth } from "./auth.interface";

@Injectable({providedIn: 'root'})
export class AuthService {
    private _http = inject(HttpClient);
    private _localStorage = inject(LocalStorageService);

    public initSchedule(): void {
        const auth: Auth = this._localStorage.getStorageData("auth");

        if(auth && auth.connection_flag) {
            const source = interval(1000 * 60 * 1); // A cada 5 minutos

            source.subscribe((val) => {
                const now: Date = new Date();
                const lastUpdated: Date = new Date(auth.last_updated);
                const expiresIn: Date = new Date(lastUpdated.getTime() + (auth.expires_in - 600));
                
                console.log("Now: ", now);
                console.log("Last Updated: ", lastUpdated);
                console.log("Expires In: ", expiresIn);
            });
        }
    }
}