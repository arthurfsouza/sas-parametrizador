import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if(this.data?.title) { this.title = this.data.title; }
    if(this.data?.description) { this.description = this.data.description; }
    if(this.data?.descriptionType) { this.descriptionType = this.data.descriptionType; }
    if(this.data?.buttonText) { this.buttonText = this.data.buttonText; }    
  }

  public title!: string;
  public description!: string;
  public descriptionType: 'string' | 'HTML' = 'string';
  public buttonText!: string;  

  public onDelete(): void { this.dialogRef.close("delete"); }
}