import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariavelFormComponent } from './variavel-form.component';

describe('VariavelFormComponent', () => {
  let component: VariavelFormComponent;
  let fixture: ComponentFixture<VariavelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariavelFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VariavelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
