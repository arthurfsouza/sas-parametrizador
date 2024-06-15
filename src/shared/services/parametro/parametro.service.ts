import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Parametro } from "../../interfaces";

@Injectable({providedIn: 'root'})
export class ParametroService {
    private _parametroSubject: BehaviorSubject<Parametro | null> = new BehaviorSubject<Parametro | null>(null);
    private _parametro = this._parametroSubject.asObservable();

    public getParametro(): Observable<Parametro | null> { return this._parametro; }

    public setParametro(parametro: any): void { this._parametroSubject.next(parametro); }
}