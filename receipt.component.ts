// frontend/hospital-management-frontend/src/app/features/payments/receipt.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService, PaymentDto } from '../../core/services/payment.service';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <div class="receipt-container" *ngIf="payment">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Payment Receipt</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="row"><strong>Payment ID:</strong> {{ payment.paymentId }}</div>
          <div class="row"><strong>Transaction ID:</strong> {{ payment.transactionId || '-' }}</div>
          <div class="row"><strong>Status:</strong> {{ payment.status }}</div>
          <div class="row"><strong>Method:</strong> {{ payment.method }}</div>
          <div class="row"><strong>Amount:</strong> ₹{{ payment.amount }}</div>
          <div class="row"><strong>Date:</strong> {{ payment.paymentDate | date:'medium' }}</div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="downloadPdf()">Download PDF</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .receipt-container { padding: 20px; max-width: 720px; margin: 0 auto; }
    .row { margin: 8px 0; }
  `]
})
export class ReceiptComponent implements OnInit {
  payment: PaymentDto | null = null;

  constructor(private route: ActivatedRoute, private paymentService: PaymentService) {}

  ngOnInit(): void {
    const nav = history.state as any;
    if (nav && nav.payment) {
      this.payment = nav.payment;
      return;
    }
    const paymentId = this.route.snapshot.paramMap.get('paymentId');
    if (paymentId) {
      // fallback: minimal placeholder if no navigation state
      this.payment = {
        id: 0,
        paymentId,
        amount: 0,
        method: 'CARD',
        status: 'SUCCESS',
        transactionId: 'TXN-PLACEHOLDER',
        paymentDate: new Date().toISOString()
      } as any;
    }
  }

  async downloadPdf(): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const y0 = 20;
    doc.setFontSize(18);
    doc.text('Payment Receipt', 14, y0);
    doc.setFontSize(12);
    if (this.payment) {
      const lines = [
        `Payment ID: ${this.payment.paymentId}`,
        `Transaction ID: ${this.payment.transactionId || '-'}`,
        `Status: ${this.payment.status}`,
        `Method: ${this.payment.method}`,
        `Amount: ₹${this.payment.amount}`,
        `Date: ${new Date(this.payment.paymentDate).toLocaleString()}`
      ];
      let y = y0 + 12;
      lines.forEach(l => { doc.text(l, 14, y); y += 8; });
    }
    doc.save('receipt.pdf');
  }
}


