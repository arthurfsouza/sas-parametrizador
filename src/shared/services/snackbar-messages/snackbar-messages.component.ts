import { Component, Inject, OnInit } from "@angular/core";
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from "@angular/material/icon";
import { SnackbarMessage } from "./snackbar-messages.interface";

@Component({
  selector: 'app-snackbar-messages-component',
  standalone: true,
  templateUrl: './snackbar-messages.component.html',
  styleUrls: ['./snackbar-messages.component.scss'],
  imports: [
    MatIconModule
  ]
})
export class SnackbarMessagesComponent implements OnInit {
  constructor(private _snackRef: MatSnackBarRef<SnackbarMessagesComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarMessage) {
      if(this.data?.title) { this.title = this.data.title; }
  }

  public title: string = "";
  public loadingBar: number = 100;
  public interval: any;

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if(this.data?.type) {
      const snackbarComponentElements: any = document.getElementsByTagName("snack-bar-container");

      for(let snackbarComponentElement of snackbarComponentElements) {
        if(snackbarComponentElement) {
          if(this.data?.type === 'error') { snackbarComponentElement!.style!.background = "#d85b55"; }
          else if(this.data?.type === 'info') { snackbarComponentElement!.style!.background = "#3e7cc2"; }
          else if(this.data?.type === 'success') { snackbarComponentElement!.style!.background = "#77c897"; }
          else if(this.data?.type === 'warning') { snackbarComponentElement!.style!.background = "#cca500"; }
        }
      }

      if(this.data?.has_duration) { this.onProgressBar(); }
    }
  }

  onProgressBar(): void {
    let elem: any = document.getElementById("custom-snackbar-bar");
    let width: number = 100;
    let intervalTime: number = 80;
    
    if(this.data?.has_duration && this.data?.duration) {
      let intervalTimeAux = (this.data.duration / 100);
      intervalTime = intervalTimeAux;
    }

    this.interval = setInterval(() => {
      if(this.loadingBar <= 0) {
        clearInterval(this.interval);
        this.loadingBar = 100;
      }
      else {
        width--;
        elem.style.width = width + "%";
      }

      this.loadingBar--;
    }, intervalTime);
  }
  
  onClose(): void { this._snackRef.dismiss(); }
}