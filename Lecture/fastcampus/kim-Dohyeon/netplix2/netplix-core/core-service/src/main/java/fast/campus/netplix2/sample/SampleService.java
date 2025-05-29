package fast.campus.netplix2.sample;

import fast.campus.netplix2.sample.response.SampleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SampleService implements SearchSampleUseCase {

  private final SamplePort samplePort;

  @Override
  public SampleResponse getSample() {
    SamplePortResponse sample = samplePort.getSample();
    return new SampleResponse(sample.getName());
  }
}
