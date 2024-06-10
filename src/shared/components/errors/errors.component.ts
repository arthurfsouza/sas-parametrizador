import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-errors',
  standalone: true,
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {  
  constructor(private _activated: ActivatedRoute) { }

  public error: string = "404";
  public errorMessages: any = {
    "401": "Você NÃO TEM AUTORIZAÇÃO para acessar o recurso solicitado.",
    "403": "Você NÃO TEM PERMISSÃO para acessar o recurso solicitado.",
    "404": "A página que você tentou acessar NÃO EXISTE!",
    "500": "Ocorreu um ERRO INTERNO, entre em contato com o Administrador do sistema."
  };
  public errorMessage: string = this.errorMessages[this.error];

  ngOnInit(): void {
    this._activated.params.subscribe(params => {
      if(params['error']) {
        this.error = params['error'];

        if(["401", "403", "404", "500"].includes(this.error)) {
          this.errorMessage = this.errorMessages[this.error];
        }
      }
    });
  }
}