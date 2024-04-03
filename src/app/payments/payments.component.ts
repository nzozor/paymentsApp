import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {PaymentService} from "../payment.service";
import {CommonModule} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {catchError, map, of, startWith, switchMap} from "rxjs";


export interface IDto {
  totalNumberOfItems: number
  numberOfPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  items: Item[]
}

export interface Item {
  id: string
  amount: number
  currency: string
  description: string
  status: string
  createdAt: string
}


@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTable, MatHeaderCell, MatColumnDef, MatCell, MatPaginator, MatHeaderCellDef, MatCellDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef],
})
export class PaymentsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'amount', 'currency', 'description', 'status', 'createdAt'];
  dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
  metaData = {
    totalNumberOfItems: 0,
    numberOfPages: 0,
    currentPage:  0,
    pageSize:  0,
    hasNext:  false,
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private paymentService: PaymentService) {}


  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;

      this.paginator.page
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.paymentService.getPayments(
              this.paginator.pageIndex + 1,
            ).pipe(catchError(() => of(null)));
          }),
        )
        .subscribe((data) => {
          this.dataSource = new MatTableDataSource(data.items);
          this.metaData = {
            totalNumberOfItems: data.totalNumberOfItems,
            numberOfPages: data.numberOfPages,
            currentPage:  data.currentPage,
            pageSize:  data.pageSize,
            hasNext:  data.hasNext,
          }
        });
  }
}
