import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

declare var sasAuthBrowser: any;

@Injectable({providedIn: 'root'})
export class SASAuthService {
    private _instance: any;

    private _instanceSubject = new BehaviorSubject(false);
    public instance = this._instanceSubject.asObservable();

    public initialize(): void {
        try {
            if(!window.document.getElementById('sas-auth-browser-santander')) {
                const url = 'assets/scripts/sas-auth-browser.min.js';
                const sasAuthBrowserTagScript = document.createElement('script');
          
                sasAuthBrowserTagScript.id = "sas-auth-browser-santander";
                sasAuthBrowserTagScript.async = true;
                sasAuthBrowserTagScript.src = url;
                sasAuthBrowserTagScript.onload = () => {
                    this._instance = sasAuthBrowser.createCookieAuthenticationCredential({
                        url: environment.application.sas.url,
                    });
            
                    this.checkAuthenticated();
                };
          
                document.head.appendChild(sasAuthBrowserTagScript);
            }
        }
        catch (e) {  console.error('Error adding SAS Auth Browser', e); }
    }

    public async checkAuthenticated(): Promise<void> {
        try {
            await this._instance.checkAuthenticated();

            this.setInstance(this._instance);
        }
        catch {
            await this._instance.loginPopup();

            this.setInstance(this._instance);
        }
    }

    public setInstance(instance: any): void { this._instanceSubject.next(instance); }

    public getInstance(): Observable<any> { return this.instance; }
}