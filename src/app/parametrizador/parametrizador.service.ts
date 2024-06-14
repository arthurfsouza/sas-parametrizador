import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ParametrizadorService {
    private _parametrizadorSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null); // Parametrizador
    private _parametrizador = this._parametrizadorSubject.asObservable();

    public getParametrizador(): Observable<any | null> { return this._parametrizador; } // Parametrizador

    public setParametrizador(parametrizador: any): void { // Parametrizador
        this._parametrizadorSubject.next(parametrizador);
    }
}