import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CryptoService } from "../crypto/crypto.service";
import { DataStorage, DataStorageTypes, LocalStorage } from "./local-storage.interface";
import { environment } from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class LocalStorageService {
    private _crypto = inject(CryptoService);

    private _localStorage: LocalStorage = { };
    private _localStorageHash: string = '';

    private _storageSubject: BehaviorSubject<DataStorage> = new BehaviorSubject<DataStorage>({});
    private _storage = this._storageSubject.asObservable();

    constructor() { }

    public getStorage(): Observable<DataStorage> { return this._storage; }

    async storageData(dataStorage: DataStorage): Promise<void> {
        if(!this._localStorage) { this._localStorage = this.initLocalStorage(); }

        if(dataStorage?.type && this._localStorage[dataStorage?.type]) { this._localStorage[dataStorage?.type] = dataStorage.data; }

        try {
            const cryptoEncrypt = this._crypto.encrypt(JSON.stringify(this._localStorage), environment.application.localStorage.secret);
            await localStorage.setItem(environment.application.localStorage.name, cryptoEncrypt);
            
            this._localStorageHash = cryptoEncrypt;
            this._storageSubject.next(dataStorage);
        }
        catch (error) { }
    }

    getStorageData(type: DataStorageTypes): any {
        const localStorageItem = localStorage.getItem(environment.application.localStorage.name);

        if(this._localStorageHash !== localStorageItem) {
            this._localStorageHash = localStorageItem ? localStorageItem : '';

            const cryptoDecrypt = localStorageItem ? this._crypto.decrypt(localStorageItem, environment.application.localStorage.secret) : null;
            const data: LocalStorage = cryptoDecrypt ? JSON.parse(cryptoDecrypt) : null;

            this._localStorage = data;

            if(!this._localStorage) { this._localStorage = this.initLocalStorage(); }   
        }

        if(type && this._localStorage[type]) { return this._localStorage[type]; }

        return null;
    }

    clearStorageData(types: DataStorageTypes[]): void {
        for(let type of types) { this.storageData({ type: type, data: null }); }        
    }

    private initLocalStorage(): LocalStorage {
        return { auth: null };
    }
}