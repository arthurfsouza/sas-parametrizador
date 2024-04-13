import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizadorVariavelFormComponent } from './parametrizador-variavel-form.component';

describe('ParametrizadorVariavelFormComponent', () => {
  let component: ParametrizadorVariavelFormComponent;
  let fixture: ComponentFixture<ParametrizadorVariavelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrizadorVariavelFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrizadorVariavelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
