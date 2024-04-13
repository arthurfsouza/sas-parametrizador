import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizadorDadosComponent } from './parametrizador-dados.component';

describe('ParametrizadorDadosComponent', () => {
  let component: ParametrizadorDadosComponent;
  let fixture: ComponentFixture<ParametrizadorDadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrizadorDadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrizadorDadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
