import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class LoaderService {    
    constructor() { }

    private isLoadingSubject = new BehaviorSubject(false);
    public isLoading = this.isLoadingSubject.asObservable();

    showLoading(option: boolean): void { this.isLoadingSubject.next(option); }
    getLoadingStatus(): Observable<boolean> { return this.isLoading; }
}