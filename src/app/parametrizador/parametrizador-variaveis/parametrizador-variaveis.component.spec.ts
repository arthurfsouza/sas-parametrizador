import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizadorVariaveisComponent } from './parametrizador-variaveis.component';

describe('ParametrizadorVariaveisComponent', () => {
  let component: ParametrizadorVariaveisComponent;
  let fixture: ComponentFixture<ParametrizadorVariaveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrizadorVariaveisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrizadorVariaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
