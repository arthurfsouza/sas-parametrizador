import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthResolve {
  constructor(private _router: Router) { }

  resolve(): void { }
}