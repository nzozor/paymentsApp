import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { PaymentsComponent } from './payments.component';
import { PaymentService } from '../../services/payment.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import {IDto} from "../../models/payments.model";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSelectChange} from "@angular/material/select";

class MockPaymentService {
  getPayments(pageIndex: number, filters: any) {
    return of({ /* Mocked response */ });
  }
}

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;
  let mockPaymentService: PaymentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  ],
      imports: [
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: PaymentService, useClass: MockPaymentService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockPaymentService = TestBed.inject(PaymentService);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should fetch initial data on ngAfterViewInit', () => {
    spyOn(mockPaymentService, 'getPayments').and.returnValue(of({  } as IDto));
      fixture.detectChanges();

    component.ngAfterViewInit();
    expect(mockPaymentService.getPayments).toHaveBeenCalled();
  });

  it('should fetch data on filter change',() => {
    spyOn(mockPaymentService, 'getPayments').and.returnValue(of({} as IDto));

    fixture.detectChanges();
    fixture.componentInstance.ngAfterViewInit();

    expect(mockPaymentService.getPayments).toHaveBeenCalled();
    component.applyStatusFilter({value: 'COMPLETED'} as MatSelectChange);
    expect(mockPaymentService.getPayments).toHaveBeenCalledWith(0, Object({ status: 'COMPLETED' }));
  });

  it('should fetch data on filter change', fakeAsync(() => {
    spyOn(mockPaymentService, 'getPayments').and.returnValue(of({} as IDto));

    fixture.detectChanges();

    component.ngAfterViewInit();
    tick(); // Completes the initial fetch.

    component.applyStatusFilter({value: 'COMPLETED'} as MatSelectChange);
    tick(); // Completes the fetch triggered by the filter change.

    fixture.detectChanges();

    expect(mockPaymentService.getPayments).toHaveBeenCalledWith(0, Object({ status: 'COMPLETED' }));
  }));

});
