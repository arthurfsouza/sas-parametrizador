import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosBuscaAvancadaComponent } from './parametros-busca-avancada.component';

describe('ParametrosBuscaAvancadaComponent', () => {
  let component: ParametrosBuscaAvancadaComponent;
  let fixture: ComponentFixture<ParametrosBuscaAvancadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrosBuscaAvancadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrosBuscaAvancadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
