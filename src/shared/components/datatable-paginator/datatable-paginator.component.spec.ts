import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatablePaginatorComponent } from './datatable-paginator.component';

describe('DatatablePaginatorComponent', () => {
  let component: DatatablePaginatorComponent;
  let fixture: ComponentFixture<DatatablePaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatatablePaginatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatatablePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
