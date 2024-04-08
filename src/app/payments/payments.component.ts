import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {IFilterTypes, PaymentService} from "../payment.service";
import {CommonModule} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {catchError, of, startWith, switchMap, tap} from "rxjs";
import {MatProgressBar} from "@angular/material/progress-bar";
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatButtonModule, MatFabButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";


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

export enum StatusFilter {
  ALL = '',
  CAPTURED = 'CAPTURED',
  COMPLETED = 'COMPLETED',
  CREATED = 'CREATED',
  FAILED = 'FAILED',
  SETTLED = 'SETTLED',
}

export interface IEmpFilter {
  name:string;
  options:string[];
  defaultValue:string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MatTable, MatHeaderCell, MatColumnDef, MatCell, MatPaginator, MatHeaderCellDef, MatCellDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef, MatProgressBar, MatSelectModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatIconModule]
})
export class PaymentsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'amount', 'currency', 'description', 'status', 'createdAt'];
  dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
  metaData = {
    totalNumberOfItems: 0,
    pageSize: 0,
    hasNext: false,
  };
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator ;
  StatusFilter = StatusFilter;
  filtersToApply = {}

  constructor(private paymentService: PaymentService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith({}),
        tap((data) => {
          this.isLoading = true;
        }),
        switchMap(() => {
          return this.paymentService.getPayments(
            this.paginator.pageIndex, this.filtersToApply
          ).pipe(
            catchError(() => of(null))
          );
        })
      ).subscribe((data) => {
        this.updateUiPaymentsTable(data);
        this.changeDetectorRef.detectChanges();
    });
  }

  applyStatusFilter(statusChange: MatSelectChange) {
    this.isLoading = true;
    Object.assign(this.filtersToApply, {status: statusChange.value });
    this.retrievePaymentsData(this.filtersToApply);

  }

  applyDateFilter(...dates: string[]) {
    this.isLoading = true;
    Object.assign(this.filtersToApply, {createdAtStart: dates[0],  createdAtEnd: dates[1] });
    this.retrievePaymentsData(this.filtersToApply);
  }

  private retrievePaymentsData(filter: Partial<IFilterTypes>) {
    this.paymentService.getPayments(0, this.filtersToApply).subscribe((data) => {
      this.updateUiPaymentsTable(data);
    });
  }

  private updateUiPaymentsTable(data: any) {
    this.metaData = {
      totalNumberOfItems: data.totalNumberOfItems,
      pageSize: data.pageSize,
      hasNext: data.hasNext,
    }
    this.isLoading = false;
    this.dataSource = new MatTableDataSource(data?.items);
  }
}
