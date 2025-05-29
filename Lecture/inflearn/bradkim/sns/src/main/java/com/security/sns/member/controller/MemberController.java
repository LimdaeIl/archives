package com.security.sns.member.controller;

import com.security.sns.common.auth.JwtTokenProvider;
import com.security.sns.member.domain.Member;
import com.security.sns.member.domain.SocialType;
import com.security.sns.member.dto.AccessTokenDto;
import com.security.sns.member.dto.GoogleProfileDto;
import com.security.sns.member.dto.KakaoProfileDto;
import com.security.sns.member.dto.MemberCreateDto;
import com.security.sns.member.dto.MemberLoginDto;
import com.security.sns.member.dto.RedirectDto;
import com.security.sns.member.service.GoogleService;
import com.security.sns.member.service.KakaoService;
import com.security.sns.member.service.MemberService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j(topic = "MemberController")
@RequiredArgsConstructor
@RequestMapping("/member")
@RestController
public class MemberController {

  private final MemberService memberService;
  private final JwtTokenProvider jwtTokenProvider;
  private final GoogleService googleService;
  private final KakaoService kakaoService;

  @PostMapping("/create")
  public ResponseEntity<?> memberCreate(@RequestBody MemberCreateDto memberCreateDto) {
    Member member = memberService.create(memberCreateDto);

    return new ResponseEntity<>(member.getId(), HttpStatus.CREATED);
  }

  @PostMapping("/doLogin")
  public ResponseEntity<?> doLogin(@RequestBody MemberLoginDto memberLoginDto) {
    Member member = memberService.login(memberLoginDto);

    // 일치할 경우 토큰 발급
    String jwtToken = jwtTokenProvider.createToken(member.getEmail(), member.getRole());

    Map<String, Object> loginInfo = new HashMap<>();
    loginInfo.put("id", member.getId());
    loginInfo.put("token", jwtToken);

    return new ResponseEntity<>(loginInfo, HttpStatus.OK);
  }


  @PostMapping("/google/doLogin")
  public ResponseEntity<?> googleLogin(@RequestBody RedirectDto redirectDto) {
//        accesstoken 발급
    AccessTokenDto accessTokenDto = googleService.getAccessToken(redirectDto.getCode());
//        사용자정보 얻기
    GoogleProfileDto googleProfileDto = googleService.getGoogleProfile(accessTokenDto.getAccess_token());
//        회원가입이 되어 있지 않다면 회원가입
    Member originalMember = memberService.getMemberBySocialId(googleProfileDto.getSub());
    log.info("회원가입 안됨 : originalMember: {}", originalMember);

    if (originalMember == null) {
      originalMember = memberService.createOauth(googleProfileDto.getSub(), googleProfileDto.getEmail(),
          SocialType.GOOGLE);
    }
//        회원가입돼 있는 회원이라면 토큰발급
    log.warn("회원가입 완료 : originalMember: {}", originalMember);

    String jwtToken = jwtTokenProvider.createToken(originalMember.getEmail(), originalMember.getRole());
    log.warn("토큰발급 완료 : jwtToken: {}", jwtToken);

    Map<String, Object> loginInfo = new HashMap<>();
    loginInfo.put("id", originalMember.getId());
    loginInfo.put("token", jwtToken);
    return new ResponseEntity<>(loginInfo, HttpStatus.OK);
  }


  @PostMapping("/kakao/doLogin")
  public ResponseEntity<?> kakaoLogin(@RequestBody RedirectDto redirectDto) {
    AccessTokenDto accessTokenDto = kakaoService.getAccessToken(redirectDto.getCode());
    KakaoProfileDto kakaoProfileDto = kakaoService.getKakaoProfile(accessTokenDto.getAccess_token());

    Member originalMember = memberService.getMemberBySocialId(kakaoProfileDto.getId());
    log.info("회원가입 안됨 : originalMember: {}", originalMember);

    if (originalMember == null) {
      originalMember = memberService.createOauth(kakaoProfileDto.getId(), kakaoProfileDto.getKakao_account().getEmail(),
          SocialType.KAKAO);
    }

    String jwtToken = jwtTokenProvider.createToken(originalMember.getEmail(), originalMember.getRole());
    log.warn("토큰발급 완료 : jwtToken: {}", jwtToken);

    Map<String, Object> loginInfo = new HashMap<>();
    loginInfo.put("id", originalMember.getId());
    loginInfo.put("token", jwtToken);
    return new ResponseEntity<>(loginInfo, HttpStatus.OK);
  }
}
