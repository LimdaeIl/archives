package com.book.toss.fpay.infrastructure.out.pg.toss.response;

import com.book.toss.fpay.domain.PaymentLedger;
import com.book.toss.fpay.domain.PaymentMethod;
import com.book.toss.fpay.domain.PaymentStatus;
import com.book.toss.fpay.infrastructure.out.pg.toss.response.payment.ResponsePaymentCommon;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.smartcardio.Card;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResponsePaymentApproved extends ResponsePaymentCommon {
  private String orderName;
  private Card card;
  private String lastTransactionKey;
  private int suppliedAmount; // 공급 가액
  private int vat;
  private String requestedAt; // 2024-06-18T15:13:15+09:00
  private String approvedAt;

  public PaymentLedger toPaymentTransactionEntity() {
    return PaymentLedger.builder()
        .paymentKey(this.getPaymentKey())
        .method(PaymentMethod.fromMethodName(this.getMethod()))
        .paymentStatus(PaymentStatus.valueOf(this.getStatus()))
        .totalAmount(this.getTotalAmount())
        .balanceAmount(this.getBalanceAmount())
        .canceledAmount(0)
        .build();
  }
}
