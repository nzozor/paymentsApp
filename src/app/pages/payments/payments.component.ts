import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
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
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {IFilterTypes, PaymentService} from "../../services/payment.service";
import {IDto, StatusFilterEnum} from "../../models/payments.model";
import {FormsModule} from "@angular/forms";



@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MatTable, MatHeaderCell, MatColumnDef, MatCell, MatPaginator, MatHeaderCellDef, MatCellDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef, MatProgressBar, MatSelectModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatIconModule, MatNoDataRow, FormsModule]
})
export class PaymentsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator ;
  private paymentService = inject(PaymentService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = ['id', 'amount', 'currency', 'description', 'status', 'createdAt'];
  dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
  metaData = {
    totalNumberOfItems: 0,
    pageSize: 0,
    hasNext: false,
  };
  isLoading = true;
  filtersToApply: any  = {};
  statusFilterEnum = StatusFilterEnum;
  noItems = true;
  statusSelectInput = '';
  dateRangeStart = '';
  dateRangeEnd = '';

  constructor() {}

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith({}),
        tap(() => this.isLoading = true),
        switchMap(() =>
          this.paymentService.getPayments(this.paginator.pageIndex, this.filtersToApply)
            .pipe(catchError(() => of(null)))
        ),
        takeUntil(this.destroy$)
      ).subscribe(data => {
      this.updateUiPaymentsTable(data as IDto);
    });
    this.changeDetectorRef.detectChanges();

  }

  applyStatusFilter(statusChange: MatSelectChange) {
    this.isLoading = true;
    Object.assign(this.filtersToApply, {status: statusChange.value });
    this.retrievePaymentsData(this.filtersToApply);
    this.paginator.pageIndex = 0;
  }

  applyDateFilter(...dates: string[]) {
    this.isLoading = true;
    Object.assign(this.filtersToApply, {createdAtStart: dates[0],  createdAtEnd: dates[1] });
    this.retrievePaymentsData(this.filtersToApply);
    this.paginator.pageIndex = 0;
  }

  clearFilters() {
    this.filtersToApply = {};
    this.statusSelectInput = '';
    this.dateRangeEnd = '';
    this.dateRangeStart = '';
    this.retrievePaymentsData({});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private retrievePaymentsData(filter: Partial<IFilterTypes>, index = 0) {
    this.paymentService.getPayments(index, this.filtersToApply).subscribe((data) => {
      this.updateUiPaymentsTable(data);
    });
  }

  private updateUiPaymentsTable(data: IDto) {
    this.metaData = {
      totalNumberOfItems: data.totalNumberOfItems,
      pageSize: data.pageSize,
      hasNext: data.hasNext,
    }
    this.noItems = !!data.items?.length;
    this.isLoading = false;
    this.dataSource = new MatTableDataSource(data?.items);
  }
}
