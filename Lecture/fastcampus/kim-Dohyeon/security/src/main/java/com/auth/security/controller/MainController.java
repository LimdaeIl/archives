package com.auth.security.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j(topic = "MainController")
@Controller
public class MainController {

  @GetMapping("/")
  public String oauth2(OAuth2AuthenticationToken token) {
    log.info("token: {}", token.getPrincipal());
    return "oauth2.html";
  }

}
