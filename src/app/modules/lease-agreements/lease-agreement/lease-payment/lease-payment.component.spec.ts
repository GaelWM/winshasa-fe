import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasePaymentComponent } from './lease-payment.component';

describe('LeasePaymentComponent', () => {
  let component: LeasePaymentComponent;
  let fixture: ComponentFixture<LeasePaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LeasePaymentComponent]
    });
    fixture = TestBed.createComponent(LeasePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
