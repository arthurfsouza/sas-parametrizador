import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface DatatablePaginatorSource {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
}

@Component({
  selector: 'datatable-paginator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './datatable-paginator.component.html',
  styleUrl: './datatable-paginator.component.scss'
})
export class DatatablePaginatorComponent implements OnInit {
  @Input() public dataSize: number = 0;
  @Input() public initialPage: number = 1;
  @Input() public pageSize: number = 25;
  @Input() public maxPages: number = 5;
  @Input() public source!: DatatablePaginatorSource;
  
  @Output() public sourceChanged = new EventEmitter<DatatablePaginatorSource>();

  public itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  public ngOnInit(): void { this.setPage(1); }

  public setPage(pageNumber: number) {
    this.source = this.paginate(this.dataSize, pageNumber, this.pageSize, this.maxPages);

    this.sourceChanged.emit(this.source);
  }

  public itensPerPageChange($event: MatSelectChange) { this.setPage(1); }

  public paginate(totalItems: number, currentPage: number = 1, pageSize: number = 10, maxPages: number = 10): DatatablePaginatorSource {
    let totalPages = Math.ceil(totalItems / pageSize);
    
    if(currentPage < 1) { currentPage = 1; } 
    else if(currentPage > totalPages) { currentPage = totalPages; }

    let startPage: number, endPage: number;

    if(totalPages <= maxPages) {
      startPage = 1;
      endPage = totalPages;
    } 
    else {
      let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;

      if(currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPages;
      }
      else if(currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPages + 1;
        endPage = totalPages;
      } 
      else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);  

    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  } 
}