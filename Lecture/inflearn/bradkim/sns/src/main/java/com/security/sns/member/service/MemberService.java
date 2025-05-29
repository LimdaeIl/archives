package com.security.sns.member.service;

import com.security.sns.member.domain.Member;
import com.security.sns.member.domain.SocialType;
import com.security.sns.member.dto.MemberCreateDto;
import com.security.sns.member.dto.MemberLoginDto;
import com.security.sns.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@RequiredArgsConstructor
@Transactional
@Service
public class MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;

  public Member create(MemberCreateDto memberCreateDto) {
    Member member = Member.builder()
        .email(memberCreateDto.getEmail())
        .password(passwordEncoder.encode(memberCreateDto.getPassword()))
        .build();

    memberRepository.save(member);
    return member;
  }

  public Member login(MemberLoginDto memberLoginDto) {
    Member member = memberRepository.findByEmail(memberLoginDto.getEmail())
        .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    if (!passwordEncoder.matches(memberLoginDto.getPassword(), member.getPassword())) {
      throw new IllegalArgumentException("Invalid password");
    }
    return member;
  }

  public Member getMemberBySocialId(String socialId) {
    Member member = memberRepository.findBySocialId(socialId)
        .orElse(null);
    return member;
  }

  public Member createOauth(String socialId, String email, SocialType socialType) {
    Member member = Member.builder()
        .email(email)
        .socialType(socialType)
        .socialId(socialId)
        .build();
    memberRepository.save(member);

      return member;
  }
}
