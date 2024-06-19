import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariaveisComponent } from './variaveis.component';

describe('VariaveisComponent', () => {
  let component: VariaveisComponent;
  let fixture: ComponentFixture<VariaveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariaveisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VariaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
