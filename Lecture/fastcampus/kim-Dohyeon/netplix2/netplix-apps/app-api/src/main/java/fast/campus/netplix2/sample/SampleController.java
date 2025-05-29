package fast.campus.netplix2.sample;

import fast.campus.netplix2.sample.response.SampleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class SampleController {

  private final SearchSampleUseCase searchSampleUseCase;

  @GetMapping("/api/v1/sample")
  public SampleResponse getSample() {
    return searchSampleUseCase.getSample();
  }
}
