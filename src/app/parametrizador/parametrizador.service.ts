import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Parametrizador } from "../../shared/interfaces/parametrizador.interface";

@Injectable({providedIn: 'root'})
export class ParametrizadorService {
    private _parametrizadorSubject: BehaviorSubject<Parametrizador | null> = new BehaviorSubject<Parametrizador | null>(null)
    private _parametrizador = this._parametrizadorSubject.asObservable();

    public getParametrizador(): Observable<Parametrizador | null> { return this._parametrizador; }

    public setParametrizador(parametrizador: Parametrizador): void {
        this._parametrizadorSubject.next(parametrizador);
    }
}