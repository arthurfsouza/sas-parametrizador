import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarMessage } from "./snackbar-messages.interface";
import { SnackbarMessagesComponent } from "./snackbar-messages.component";

@Injectable({providedIn: 'root'})
export class SnackbarMessagesService {
    constructor(private _snackbar: MatSnackBar) { }

    public showSnackbarMessages(snack: SnackbarMessage): void {
        if(!snack.title) {
            if(snack.type === "error") { snack.title = "ERRO"; }
            else if(snack.type === "info") { snack.title = "INFO"; }
            else if(snack.type === "success") { snack.title = "SUCESSO"; }
            else if(snack.type === "warning") { snack.title = "AVISO"; }
        }

        if(snack.has_duration) {
            this._snackbar.openFromComponent(SnackbarMessagesComponent, {
                duration: snack.duration ? snack.duration : 8000,
                horizontalPosition: "end",
                verticalPosition: "top",
                data: snack
            });
        }
        else {
            this._snackbar.openFromComponent(SnackbarMessagesComponent, {
                horizontalPosition: "end",
                verticalPosition: "top",
                data: snack
            });
        }
    }
}