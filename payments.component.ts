// frontend/hospital-management-frontend/src/app/features/payments/payments.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// No real payment service used; we navigate with dummy data

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <div class="payments-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Choose Payment Method</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="method-switch">
            <button mat-raised-button color="primary" (click)="activeTab='CARD'" [disabled]="activeTab==='CARD'">Card</button>
            <button mat-raised-button color="accent" (click)="activeTab='UPI'" [disabled]="activeTab==='UPI'">UPI</button>
          </div>

          <ng-container *ngIf="activeTab==='CARD'">
            <form [formGroup]="cardForm" (ngSubmit)="submitCard()" novalidate class="form">
              <div class="grid">
                <mat-form-field appearance="outline">
                  <mat-label>Cardholder Name</mat-label>
                  <input matInput formControlName="cardholderName" />
                  <mat-error *ngIf="cardForm.get('cardholderName')?.hasError('required')">Cardholder name is required.</mat-error>
                  <mat-error *ngIf="cardForm.get('cardholderName')?.hasError('minlength')">Name must be at least 3 characters.</mat-error>
                  <mat-error *ngIf="cardForm.get('cardholderName')?.hasError('maxlength')">Name must be 50 characters or less.</mat-error>
                  <mat-error *ngIf="cardForm.get('cardholderName')?.hasError('pattern')">Only letters and spaces are allowed.</mat-error>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Card Number</mat-label>
                  <input matInput formControlName="cardNumber" maxlength="19" placeholder="#### #### #### ####" (input)="onCardNumberInput($event)" />
                  <mat-hint align="end">16 digits</mat-hint>
                  <mat-error *ngIf="cardForm.get('cardNumber')?.hasError('required')">Card number is required.</mat-error>
                  <mat-error *ngIf="cardForm.get('cardNumber')?.hasError('pattern')">Invalid card number.</mat-error>
                </mat-form-field>
                <div class="expiry-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Expiry Month</mat-label>
                    <mat-select formControlName="expiryMonth">
                      <mat-option *ngFor="let m of months" [value]="m.value">{{ m.label }}</mat-option>
                    </mat-select>
                    <mat-error *ngIf="cardForm.get('expiryMonth')?.hasError('required')">Month is required.</mat-error>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Expiry Year</mat-label>
                    <mat-select formControlName="expiryYear">
                      <mat-option *ngFor="let y of years" [value]="y">{{ y }}</mat-option>
                    </mat-select>
                    <mat-error *ngIf="cardForm.get('expiryYear')?.hasError('required')">Year is required.</mat-error>
                  </mat-form-field>
                </div>
                <mat-form-field appearance="outline">
                  <mat-label>CVV</mat-label>
                  <input matInput formControlName="cvv" maxlength="4" (input)="onCvvInput($event)" />
                  <mat-hint align="end">3 or 4 digits</mat-hint>
                  <mat-error *ngIf="cardForm.get('cvv')?.hasError('required')">CVV is required.</mat-error>
                  <mat-error *ngIf="cardForm.get('cvv')?.hasError('pattern')">Invalid CVV.</mat-error>
                </mat-form-field>
                <mat-form-field appearance="outline" class="full">
                  <mat-label>Billing Address (optional)</mat-label>
                  <input matInput formControlName="billingAddress" />
                </mat-form-field>
                <mat-form-field appearance="outline" class="full">
                  <mat-label>Amount</mat-label>
                  <input matInput type="number" formControlName="amount" />
                  <mat-error *ngIf="cardForm.get('amount')?.hasError('required')">Amount is required.</mat-error>
                  <mat-error *ngIf="cardForm.get('amount')?.hasError('min')">Amount must be greater than 0.</mat-error>
                </mat-form-field>
              </div>

              <button mat-raised-button color="primary" type="submit" [disabled]="cardForm.invalid || submitting">
                {{ submitting ? 'Processing...' : 'Pay Now' }}
              </button>
            </form>
          </ng-container>

          <ng-container *ngIf="activeTab==='UPI'">
            <div class="method-switch">
              <button mat-stroked-button color="primary" (click)="upiMode='ID'" [disabled]="upiMode==='ID'">UPI ID</button>
              <button mat-stroked-button color="primary" (click)="upiMode='QR'" [disabled]="upiMode==='QR'">QR</button>
            </div>

            <form *ngIf="upiMode==='ID'" [formGroup]="upiIdForm" (ngSubmit)="submitUpiId()" novalidate class="form">
              <div class="grid">
                <mat-form-field appearance="outline" class="full">
                  <mat-label>UPI ID</mat-label>
                  <input matInput formControlName="upiId" placeholder="name@bank" />
                  <mat-error *ngIf="upiIdForm.get('upiId')?.hasError('required')">UPI ID is required.</mat-error>
                  <mat-error *ngIf="upiIdForm.get('upiId')?.hasError('pattern')">Enter a valid UPI ID (e.g., name&#64;bank).</mat-error>
                </mat-form-field>
                <mat-form-field appearance="outline" class="full">
                  <mat-label>Amount</mat-label>
                  <input matInput type="number" formControlName="amount" />
                  <mat-error *ngIf="upiIdForm.get('amount')?.hasError('required')">Amount is required.</mat-error>
                  <mat-error *ngIf="upiIdForm.get('amount')?.hasError('min')">Amount must be greater than 0.</mat-error>
                </mat-form-field>
              </div>
              <button mat-raised-button color="primary" type="submit" [disabled]="upiIdForm.invalid || submitting">
                {{ submitting ? 'Processing...' : 'Pay with UPI' }}
              </button>
            </form>

            <form *ngIf="upiMode==='QR'" [formGroup]="upiQrForm" (ngSubmit)="submitUpiQr()" novalidate class="form">
              <div class="qr-box" *ngIf="qrDataUrl; else qrEmpty">
                <img [src]="qrDataUrl" alt="UPI QR" />
              </div>
              <ng-template #qrEmpty>
                <div class="qr-placeholder">QR will appear after entering amount</div>
              </ng-template>
              <mat-form-field appearance="outline" class="full">
                <mat-label>Amount</mat-label>
                <input matInput type="number" formControlName="amount" (input)="updateQr()" />
                <mat-error *ngIf="upiQrForm.get('amount')?.hasError('required')">Amount is required.</mat-error>
                <mat-error *ngIf="upiQrForm.get('amount')?.hasError('min')">Amount must be greater than 0.</mat-error>
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit" [disabled]="upiQrForm.invalid || submitting">
                {{ submitting ? 'Processing...' : 'Pay after Scan' }}
              </button>
            </form>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .payments-container { padding: 24px; max-width: 760px; margin: 0 auto; }
    mat-card { box-shadow: 0 6px 16px rgba(0,0,0,0.12); border-radius: 12px; }
    .method-switch { display: flex; gap: 12px; margin-bottom: 16px; }
    .form { display: block; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .expiry-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
    .full { grid-column: 1 / -1; }
    .qr-box { display: flex; justify-content: center; margin: 16px 0; }
    .qr-box img { width: 200px; height: 200px; image-rendering: pixelated; }
    .qr-placeholder { width: 200px; height: 200px; border: 2px dashed #90caf9; display: flex; align-items: center; justify-content: center; color: #1976d2; border-radius: 8px; }
  `]
})
export class PaymentsComponent {
  activeTab: 'CARD' | 'UPI' = 'CARD';
  upiMode: 'ID' | 'QR' = 'ID';
  submitting = false;

  cardForm: FormGroup;
  upiIdForm: FormGroup;
  upiQrForm: FormGroup;
  cardError = '';
  upiError = '';
  qrDataUrl: string | null = null;

  // In a real flow, these would come from appointment context
  appointmentId = 1;
  patientId = 1;

  constructor(private fb: FormBuilder, private router: Router) {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 15 }, (_, i) => currentYear + i);

    this.cardForm = this.fb.group({
      cardholderName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', [Validators.required]],
      expiryYear: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      billingAddress: [''],
      amount: [null, [Validators.required, Validators.min(1)]]
    });

    this.upiIdForm = this.fb.group({
      upiId: ['', [Validators.required, Validators.pattern(/^[\w.-]{2,}@[\w.-]{2,}$/)]],
      amount: [null, [Validators.required, Validators.min(1)]]
    });

    this.upiQrForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  months = [
    { value: '01', label: '01 - Jan' },
    { value: '02', label: '02 - Feb' },
    { value: '03', label: '03 - Mar' },
    { value: '04', label: '04 - Apr' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - Jun' },
    { value: '07', label: '07 - Jul' },
    { value: '08', label: '08 - Aug' },
    { value: '09', label: '09 - Sep' },
    { value: '10', label: '10 - Oct' },
    { value: '11', label: '11 - Nov' },
    { value: '12', label: '12 - Dec' }
  ];
  years: number[] = [];

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g) || [];
    input.value = groups.join(' ');
    this.cardForm.get('cardNumber')?.setValue(digits, { emitEvent: false });
  }

  onCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = digits;
    this.cardForm.get('cvv')?.setValue(digits, { emitEvent: false });
  }

  private generateTxnId(): string {
    return 'TXN-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  }

  submitCard(): void {
    this.cardError = '';
    if (this.cardForm.invalid) {
      this.cardError = 'Please correct the highlighted errors and try again.';
      return;
    }
    const { cardholderName, cardNumber, expiryMonth, expiryYear, cvv, billingAddress, amount } = this.cardForm.value;
    const expiryDate = `${expiryMonth}/${String(expiryYear).slice(-2)}`;
    const txn = this.generateTxnId();
    const dummyPayment = { paymentId: 'PAY-' + Math.random().toString(36).slice(2,10).toUpperCase(), transactionId: txn, status: 'SUCCESS', method: 'CARD', amount, paymentDate: new Date().toISOString() };
    this.router.navigate(['/receipt', dummyPayment.paymentId], { state: { payment: dummyPayment } });
  }

  submitUpiId(): void {
    this.upiError = '';
    if (this.upiIdForm.invalid) {
      this.upiError = 'Please enter a valid UPI ID and amount.';
      return;
    }
    const { upiId, amount } = this.upiIdForm.value;
    const txn = this.generateTxnId();
    const dummyPayment = { paymentId: 'PAY-' + Math.random().toString(36).slice(2,10).toUpperCase(), transactionId: txn, status: 'SUCCESS', method: 'UPI', amount, paymentDate: new Date().toISOString() };
    this.router.navigate(['/receipt', dummyPayment.paymentId], { state: { payment: dummyPayment } });
  }

  submitUpiQr(): void {
    if (this.upiQrForm.invalid) {
      this.upiError = 'Please enter a valid amount.';
      return;
    }
    const { amount } = this.upiQrForm.value;
    const txn = this.generateTxnId();
    const dummyPayment = { paymentId: 'PAY-' + Math.random().toString(36).slice(2,10).toUpperCase(), transactionId: txn, status: 'SUCCESS', method: 'UPI', amount, paymentDate: new Date().toISOString() };
    this.router.navigate(['/receipt', dummyPayment.paymentId], { state: { payment: dummyPayment } });
  }

  async updateQr(): Promise<void> {
    const amount = this.upiQrForm.get('amount')?.value;
    if (!amount || amount <= 0) {
      this.qrDataUrl = null;
      return;
    }
    try {
      const QRCode: any = await import('qrcode');
      const data = `upi://pay?pa=dummy@upi&am=${amount}`;
      this.qrDataUrl = await QRCode.toDataURL(data, { width: 200, margin: 1 });
    } catch {
      this.qrDataUrl = null;
    }
  }
}
