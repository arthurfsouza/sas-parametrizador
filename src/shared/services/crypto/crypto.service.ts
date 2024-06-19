import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({providedIn: 'root'})
export class CryptoService {    
    encrypt(name: string, secret: string) { return CryptoJS.AES.encrypt(name, secret).toString(); }

    decrypt(name: string, secret: string): string { return CryptoJS.AES.decrypt(name, secret).toString(CryptoJS.enc.Utf8); }
}