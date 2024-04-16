import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Parametrizador } from '../parametrizador.interface';
import { ParametrizadorService } from '../parametrizador.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-parametrizador-revisao',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './parametrizador-revisao.component.html',
  styleUrl: './parametrizador-revisao.component.scss'
})
export class ParametrizadorRevisaoComponent implements OnInit {
  private _parametrizador = inject(ParametrizadorService);
  public parametrizador!: Parametrizador;

  ngOnInit(): void {
    this._parametrizador.getParametrizador().subscribe(parametrizador => {
      if(parametrizador) { this.parametrizador = parametrizador; console.log(this.parametrizador); }
    });
  }

  public getDataVigencia(): string {
    let dataFormat: string = "-";
    let dataVigencia: any = this.parametrizador?.parametro?.dataVigencia || null;
    let horaVigencia: any = this.parametrizador?.parametro?.horaVigencia || null;


    if(horaVigencia && dataVigencia && dataVigencia._d) {
      dataFormat = dataVigencia._d.toLocaleDateString() + " - " + horaVigencia;
    }

    return dataFormat;
  }
}
