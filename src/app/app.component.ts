import { Component } from '@angular/core';
import {PaymentsComponent} from "./pages/payments/payments.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaymentsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vynePayment';
}
