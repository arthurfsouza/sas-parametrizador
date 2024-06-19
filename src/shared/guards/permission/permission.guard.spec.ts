import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PermissionGuard } from './permission.guard';

describe('PermissionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [PermissionGuard]
    });
  });

  it('should ...', inject([PermissionGuard], (guard: PermissionGuard) => {
    expect(guard).toBeTruthy();
  }));
});