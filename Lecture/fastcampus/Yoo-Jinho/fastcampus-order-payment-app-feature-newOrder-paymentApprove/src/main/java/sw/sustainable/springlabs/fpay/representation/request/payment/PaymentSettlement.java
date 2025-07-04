package sw.sustainable.springlabs.fpay.representation.request.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentSettlement {
    private String startDate;
    private String endDate;
    private int page;
    private int size;
}
