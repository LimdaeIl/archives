package com.security.sns.common.auth;


import com.security.sns.member.domain.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class JwtTokenProvider {

  private final SecretKey secretKey;

  @Value("${jwt.access.expiration}")
  private long expiration;

  public JwtTokenProvider(@Value("${jwt.secret}") String base64Secret) {
    byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
    this.secretKey = Keys.hmacShaKeyFor(keyBytes);
  }

  public String createToken(String email, Role role) {
    return Jwts.builder()
        .subject(email)
        .claim("ROLE", role.toString())
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + expiration * 60 * 1000L))
        .signWith(secretKey)
        .compact();
  }
}
