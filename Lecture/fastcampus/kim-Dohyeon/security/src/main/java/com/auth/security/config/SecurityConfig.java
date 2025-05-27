package com.auth.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  @Value("${security.config.client}")
  private String client;

  @Value("${security.config.secret}")
  private String clientSecret;

  public ClientRegistrationRepository clientRegistrationRepository() {
    ClientRegistration build = CommonOAuth2Provider.GITHUB.getBuilder("github")
        .clientId(client)
        .clientSecret(clientSecret)
        .build();
    return new InMemoryClientRegistrationRepository(build);
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .oauth2Login(oauth -> oauth
            .clientRegistrationRepository(clientRegistrationRepository()));

    http
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated());

    return http.build();
  }

}
