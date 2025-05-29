package com.security.sns.common.config;

import com.security.sns.common.auth.JwtTokenFilter;
import com.security.sns.member.service.GoogleOauth2LoginSuccess;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

  private final JwtTokenFilter jwtTokenFilter;
  private final GoogleOauth2LoginSuccess googleOauth2LoginSuccess;

  public SecurityConfig(JwtTokenFilter jwtTokenFilter, GoogleOauth2LoginSuccess googleOauth2LoginSuccess) {
    this.jwtTokenFilter = jwtTokenFilter;
    this.googleOauth2LoginSuccess =googleOauth2LoginSuccess;
  }

  @Bean
  public PasswordEncoder makePasswordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(configurationSource()))
        .csrf(AbstractHttpConfigurer::disable) // csrf 비활성화
        // Basic 인증 비활성화. Basic 인증은 사용자 이름과 비밀번호를 Base64로 인코딩하여 인증값으로 활용
        // jwt 토큰은 시크릿 키로 암호화되어 있기 때문에 명확히 http basic 과 전혀 다르다.
        .httpBasic(AbstractHttpConfigurer::disable)
        .sessionManagement(AbstractHttpConfigurer::disable); // 세션 방식을 비활성화 기본적으로 동작 방식이 전혀 다르다.

    http
        .authorizeHttpRequests(a -> a // 특정 url 패턴에 대해서 인증 처리(Authentication 객체생성)
            .requestMatchers("/member/create", "/member/doLogin", "/member/google/doLogin", "/member/kakao/doLogin", "/oauth2/**").permitAll()
            .anyRequest().authenticated());

    http
        // UsernamePasswordAuthenticationFilter가 클래스에서 폼 로그인 인증을 처리
        .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
        // .oauth 로그인이 성공했을 경우 실행할 클래스 정의
        .oauth2Login(o -> o.successHandler(googleOauth2LoginSuccess));

    return http.build();
  }

  @Bean
  public CorsConfigurationSource configurationSource(){
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("*")); //모든 HTTP메서드 허용
    configuration.setAllowedHeaders(Arrays.asList("*")); //모든 헤더값 허용
    configuration.setAllowCredentials(true); //자격증명허용

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);// 모든 url 패턴에 대해서 cors 허용 설정

    return source;
  }
}
