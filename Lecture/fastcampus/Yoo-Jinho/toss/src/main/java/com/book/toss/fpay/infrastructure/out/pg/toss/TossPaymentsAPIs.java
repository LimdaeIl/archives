package com.book.toss.fpay.infrastructure.out.pg.toss;

import com.book.toss.fpay.infrastructure.out.pg.toss.response.ResponsePaymentApproved;
import com.book.toss.fpay.representation.request.payment.PaymentApproved;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface TossPaymentsAPIs {

  @POST("/payments/confirm")
  Call<ResponsePaymentApproved> paymentFullFill(@Body PaymentApproved paymentApproved);

}
