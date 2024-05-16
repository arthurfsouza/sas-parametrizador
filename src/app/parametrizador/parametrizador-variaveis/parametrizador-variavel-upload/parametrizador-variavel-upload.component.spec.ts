import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizadorVariavelUploadComponent } from './parametrizador-variavel-upload.component';

describe('ParametrizadorVariavelUploadComponent', () => {
  let component: ParametrizadorVariavelUploadComponent;
  let fixture: ComponentFixture<ParametrizadorVariavelUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrizadorVariavelUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrizadorVariavelUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
