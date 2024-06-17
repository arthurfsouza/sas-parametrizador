import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Parametro } from "../../interfaces";

@Injectable({providedIn: 'root'})
export class ParametroService {
    private _parametroSubject: BehaviorSubject<Parametro | null> = new BehaviorSubject<Parametro | null>(null);
    private _parametro = this._parametroSubject.asObservable();

    private _isEditavelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _isEditavel = this._isEditavelSubject.asObservable();

    public getParametro(): Observable<Parametro | null> { return this._parametro; }
    public setParametro(parametro: any): void { this._parametroSubject.next(parametro); }

    public getIsEditavel(): Observable<boolean> { return this._isEditavel; }
    public setIsEditavel(isEditavel: boolean): void { this._isEditavelSubject.next(isEditavel); }
}