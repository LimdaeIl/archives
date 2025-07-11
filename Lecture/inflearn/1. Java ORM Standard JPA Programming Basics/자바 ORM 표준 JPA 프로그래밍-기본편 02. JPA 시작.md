# 자바 ORM 표준 JPA 프로그래밍-기본편: 02. JPA 시작



## 1. Hello JPA - 프로젝트 생성

### H2 데이터베이스 설치와 실행

**H2 Database**는 다음과 같은 특징을 가진 **경량형 관계형 데이터베이스(RDBMS)**입니다.

| 항목      | 내용                                        |
| --------- | ------------------------------------------- |
| 종류      | 오픈소스(Embedded / Server 모드 지원)       |
| 장점      | 가볍고 빠름, 설치 없이 바로 사용 가능       |
| 용도      | **로컬 테스트용**, **JPA 학습**, CI 환경 등 |
| 지원      | SQL, JDBC, Web Console, 다양한 Dialect      |
| 파일 크기 | 약 1.5MB로 매우 작음                        |



**H2 사용 모드**

| 모드                         | 설명                                                      |
| ---------------------------- | --------------------------------------------------------- |
| **임베디드 모드 (Embedded)** | 애플리케이션과 함께 메모리 내에서 실행. 테스트용으로 좋음 |
| **서버 모드 (Server)**       | TCP로 외부에서 접속 가능. 실습용 다중 접속에 유용         |
| **웹 콘솔 (Web Console)**    | 웹 브라우저에서 SQL 실행 가능. 시각적 디버깅에 유용       |



**설치 및 실행**

1. **H2 다운로드**

   - 공식 사이트: https://www.h2database.com
   - `All Platforms` → `.zip` 다운로드

   Spring Boot에 내장된 경우 자동 실행됩니다. (application.yml 설정 필요)



**Spring Boot에서 H2 접속 설정 예시 (`application.yml`)**

```yml
spring:
  datasource:
    url: jdbc:h2:tcp://localhost/~/test
    driver-class-name: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true
      path: /h2-console
```

- 접속 설정에 대한 설명은 아래 application.yml 설명과 함께 정리되어 있습니다.



**H2 웹 콘솔 접속 방법**

| 항목     | 값                                                         |
| -------- | ---------------------------------------------------------- |
| 접속 URL | `http://localhost:8080/h2-console`                         |
| JDBC URL | `jdbc:h2:tcp://localhost/~/test` 또는 `jdbc:h2:mem:testdb` |
| 사용자명 | `sa`                                                       |
| 비밀번호 | (기본 비어 있음)                                           |



**JDBC URL 설명**

| URL                              | 설명                                      |
| -------------------------------- | ----------------------------------------- |
| `jdbc:h2:mem:testdb`             | 메모리 모드 (앱 종료 시 데이터 사라짐)    |
| `jdbc:h2:tcp://localhost/~/test` | 서버 모드, `~/test.mv.db` 파일로 저장됨   |
| `jdbc:h2:file:~/test`            | 파일 기반 저장 방식 (직접 파일 지정 가능) |

 

**정리**

| 장점          | 설명                        |
| ------------- | --------------------------- |
| 빠르고 가벼움 | 별도 설치 없이 바로 사용    |
| 웹 콘솔 지원  | 브라우저로 DB 확인 가능     |
| SQL 표준 지원 | 대부분의 SQL 문법 사용 가능 |
| 테스트에 최적 | JPA와 함께 자주 사용됨      |



### build.gradle.kts

**`build.gradle.kts` (Kotlin DSL 기준, Gradle 8.x 이상)**

```kotlin
plugins {
    id("org.springframework.boot") version "3.2.5"
    id("io.spring.dependency-management") version "1.1.4"
    id("java")
}

group = "jpa-basic"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa") // JPA + Hibernate 포함
    implementation("org.springframework.boot:spring-boot-starter")
    runtimeOnly("com.h2database:h2") // 실습용 DB
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

```



### **settings.gradle.kts**

```kotlin
rootProject.name = "ex1-hello-jpa"
```



### application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:tcp://localhost/~/test
    driver-class-name: org.h2.Driver
    username: sa
    password:

  jpa:
    hibernate:
      ddl-auto: none # create, update, validate, none
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
        show_sql: true
        format_sql: true
        use_sql_comments: true

  h2:
    console:
      enabled: true
      path: /h2-console
```

- `spring.datasource`: DB(H2)와 연결 설정 (URL, 계정 등)
- `spring.jpa`: JPA 동작 설정 (스키마 자동 처리, SQL 로그 등)
- `spring.h2.console`: 웹 콘솔 활성화 및 접속 경로 지정



**`application.yml` 설정**

```yml
spring:
  datasource:
    ...
  jpa:
    ...
  h2:
    ...
```

- `spring:` 은 Spring Boot의 설정이자 최상위 루트
- 그 아래 `datasource`, `jpa`, `h2`는 각각 데이터베이스 연결, JPA 설정, H2 웹 콘솔 설정을 담당



**`spring.datasource`: 데이터베이스 연결 설정**

```yaml
datasource:
  url: jdbc:h2:tcp://localhost/~/test # H2 연결 주소
  driver-class-name: org.h2.Driver # JDBC 드라이버 클래스 이름 (H2 전용 드라이버)
  username: sa # 기본 사용자 계정(sa)
  password:    # 기본 비밀번호(없음)
```



**`spring.h2.console` - 웹 콘솔 설정**

```yaml
h2:
  console:
    enabled: true  # true이면 웹 브라우저에서 DB 콘솔 접속 허용
    path: /h2-console  # 콘솔 URL 경로(접속 주소: http://localhost:포트번호/h2-console)
```

> 🔐 주의: 콘솔은 **로컬 개발용으로만 사용**해야 하며, 운영 환경에서는 반드시 비활성화해야 합니다.



**`spring.jpa`: JPA 및 Hibernate 설정**

```yaml
jpa:
  hibernate:
    ddl-auto: none # DDL 자동 실행 설정
  properties:
    hibernate:
      dialect: org.hibernate.dialect.H2Dialect # DB 방언 설정
      show_sql: true   # 실행되는 SQL을 콘솔에 출력(디버깅용)
      format_sql: true   # SQL을 보기 좋게 변경(preti)
      use_sql_comments: true   # 실행되는 SQL에 JPA 관련 주석 추가(어느 쿼리인지 주석)
```

**`jpa.hibernate.ddl-auto`: 속성 종류**

- `none`: 스키마 자동 생성 / 변경을 하지 않음
- `create`: 실행 시 기존 테이블 제거 후 새로 생성
- `create-drop`: 애플리케이션 종료 시 테이블 제거
- `update`: 변경 사항에 따라 테이블 자동 갱신
- `validate`: 엔티티와 DB 스키마가 일치하는지만 검증



### **`jpa.properties.hibernate.dialect:` 방언 설정**

![image-20250711172250229](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711172250229.png)

**JPA(Hibernate)**는 **데이터베이스 독립성**을 지향합니다. 하지만 실제 DB마다 SQL 문법이나 기능이 **조금씩 다르기 때문에**, JPA는 DB에 맞는 SQL을 자동 생성하기 위해 **방언(Dialect)**을 사용합니다.



**왜 방언이 필요한가?**

| 이유              | 설명                                             |
| ----------------- | ------------------------------------------------ |
| SQL 문법 차이     | 예: 문자열 자르기 `SUBSTRING()` vs `SUBSTR()`    |
| 자료형 차이       | 예: `VARCHAR` vs `VARCHAR2`                      |
| 페이징 방식 차이  | `LIMIT/OFFSET` (MySQL) vs `ROWNUM` (Oracle)      |
| 함수명 차이       | 날짜 처리 함수, 현재 시간 등                     |
| 자동 키 생성 방식 | `AUTO_INCREMENT`, `SEQUENCE`, `IDENTITY` 등 다름 |



**Hibernate 주요 방언 목록**

Hibernate는 40개 이상의 DB 방언을 기본 지원합니다. 

| DB 종류             | Dialect 클래스명                             |
| ------------------- | -------------------------------------------- |
| **H2**              | `org.hibernate.dialect.H2Dialect`            |
| **MySQL 5**         | `org.hibernate.dialect.MySQL5Dialect`        |
| **MySQL 5 InnoDB**  | `org.hibernate.dialect.MySQL5InnoDBDialect`  |
| **MySQL 8**         | `org.hibernate.dialect.MySQL8Dialect`        |
| **PostgreSQL**      | `org.hibernate.dialect.PostgreSQLDialect`    |
| **Oracle 10g**      | `org.hibernate.dialect.Oracle10gDialect`     |
| **Oracle 12c**      | `org.hibernate.dialect.Oracle12cDialect`     |
| **SQL Server 2012** | `org.hibernate.dialect.SQLServer2012Dialect` |
| **DB2**             | `org.hibernate.dialect.DB2Dialect`           |
| **MariaDB**         | `org.hibernate.dialect.MariaDB103Dialect`    |



**설정 위치 (Spring Boot 기준)**

```yaml
spring:
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```



**동작 방식 요약**

```apl
@Entity → JPA → Hibernate → DB 방언(Dialect) → 적절한 SQL 생성 → DB 실행
```



**자동 감지 vs 명시적 지정**

| 방법                   | 설명                                                 |
| ---------------------- | ---------------------------------------------------- |
| **자동 감지**          | 데이터베이스 드라이버 기반으로 Hibernate가 자동 선택 |
| **명시적 지정 (권장)** | 방언을 직접 지정하여 예측 가능성 확보 및 오류 방지   |



**실무에서 주의할 점**

- 잘못된 방언을 사용하면 SQL 오류 발생 가능
- H2는 다양한 DB를 흉내낼 수 있으므로 테스트 환경에서 방언 일치 여부를 주의해야 함
- Hibernate 6.x부터는 **일부 방언 클래스가 변경되거나 제거됨** → Hibernate 공식 문서 참고



**정리**

| 항목      | 설명                                                         |
| --------- | ------------------------------------------------------------ |
| 정의      | Hibernate가 DB 특성에 맞춰 SQL을 생성하기 위한 전략 클래스   |
| 사용 이유 | DB 종류별 SQL 문법/기능 차이를 추상화                        |
| 설정 위치 | `spring.jpa.properties.hibernate.dialect`                    |
| 대표 방언 | `H2Dialect`, `MySQL8Dialect`, `PostgreSQLDialect`, `Oracle12cDialect` 등 |
| 실무 팁   | 테스트 DB(H2)도 실제 운영 DB와 같은 방언을 설정해야 오류를 줄일 수 있음 |



### Java 17 호환성 관련 주의 사항

- Hibernate 5.x는 Java 17에서도 사용할 수 있지만, **Hibernate 6.x 이상을 권장**합니다.
- `javax.persistence`는 더 이상 표준이 아니며, Jakarta EE 9부터는 `jakarta.persistence`로 이동했습니다.
  호환성 이슈가 없다면 **`jakarta.persistence-api`를 사용하는 것이 최신 방식**입니다.
- H2는 **최신 버전(`2.2.x`)을 사용**하는 것을 권장하고 있습니다.





## 2. Hello JPA - 애플리케이션 개발

### JPA 구동 방식(Spring Boot + YAML 기준)

JPA는 애플리케이션이 실행되면 다음과 같은 순서로 동작합니다.

**1. `@SpringBootApplication` 실행**

- Spring Boot 애플리케이션이 시작되면서 내부적으로 자동으로 JPA 설정을 초기화합니다.

```java
@SpringBootApplication
public class JpaApplication {
    public static void main(String[] args) {
        SpringApplication.run(JpaApplication.class, args);
    }
}
```



**2. `application.yml`을 통해 DataSource 및 JPA 설정 로딩**

- `spring.datasource`로 DB 연결 설정(H2)
- `spring.jpa`로 Hibernate 관련 설정(DDL 전략, SQL 로그 및 설정 등)
- `spring.h2.console`로 웹 콘솔 설정



**3. `DataSource` 및 `EntityManagerFactory` 자동 생성**

- 내부적으로 다음을 자동 구성됩니다.
  - `DataSource` (HikariCP 기본)
  - `JpaVendorAdapter` (Hibernate 설정)
  - **`EntityManagerFactory` (JPA 핵심 객체)**
  - **`TransactionManager` (JPA 트랜잭션 관리)**

```java
application.yml
   ↓
Spring Boot
   ↓
DataSource → EntityManagerFactory → EntityManager
```



**4. 엔티티 클래스 분석 및 테이블 매핑**

- `@Entity`가 붙은 클래스들을 스캔하여 테이블과 매핑
- `ddl-auto` 전략에 따라 테이블을 생성하거나 검증

```java
@Entity
public class Member {
    @Id
    private Long id;
    private String name;
}
```

```sql
-- 동일한 member 테이블 생성
create table member (
    id bigint not null,
    name varchar(255),
    primary key (id)
);
```



**5. 애플리케이션 내에서 EntityManager 사용**

- `JpaRepository`, `EntityManager`, `@Transactional` 등을 통해 데이터 접근
- 모든 데이터 변경은 반드시 **트랜잭션 안에서** 수행

```java
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    @Transactional
    public void saveMember(Member member) {
        memberRepository.save(member);
    }
}
```



**6. SQL 실행 → 로그 출력 (설정된 옵션에 따라)**

- `show_sql: true`, `format_sql: true`, `use_sql_comments: true` 설정에 따라 실행 SQL이 콘솔에 출력됩니다.

```sql
-- insert member 콘솔창 출력
insert into member (id, name) values (?, ?)
```



### **핵심 정리**

| 단계  | 설명                                                         |
| ----- | ------------------------------------------------------------ |
| 1단계 | 프로젝트 실행 시점에 `application.yml` 로 Spring Boot가 JPA 설정 자동 처리 |
| 2단계 | H2 DB 연결 및 `EntityManagerFactory` 생성                    |
| 3단계 | `@Entity` 스캔 → 테이블 매핑 및 DDL 처리                     |
| 4단계 | `Repository` 또는 `EntityManager` 통해 트랜잭션 처리         |
| 5단계 | SQL 실행 및 로그 출력 (디버깅 가능)                          |



### **JPQL**

**JPQL (Java Persistence Query Language)**은 **객체지향 쿼리 언어**입니다. 
JPA를 사용하는 애플리케이션에서 **객체(Entity)를 대상으로 데이터를 검색(조회)**하기 위해 사용하는 쿼리 언어 입니다.



**왜 JPQL이 필요한가?**

JPA에서는 엔티티 객체(Entity)를 중심으로 데이터를 관리합니다. 하지만 **검색(조회)**은 다음과 같은 문제가 있습니다.

| 방식                   | 문제                                       |
| ---------------------- | ------------------------------------------ |
| `EntityManager.find()` | PK로만 조회 가능                           |
| SQL 직접 사용          | 테이블 중심이므로 JPA의 객체 모델과 분리됨 |

👉 그래서 **엔티티 객체를 대상으로 조건 검색을 할 수 있는 언어**가 필요합니다. → JPQL을 통해 극복할 수 있습니다.



**JPQL vs SQL**

| 항목 | JPQL                                     | SQL          |
| ---- | ---------------------------------------- | ------------ |
| 대상 | **엔티티 객체**                          | 테이블       |
| 결과 | **객체(Entity)**                         | 행(Row)      |
| 문법 | SQL과 유사 (SELECT, WHERE, JOIN 등 지원) | 전통적인 SQL |

```sql
-- JPQL
SELECT m FROM Member m WHERE m.name = '홍길동'

-- SQL
SELECT * FROM member WHERE name = '홍길동'
```



**JPA와 JPQL의 관계**

- JPA는 **JPQL을 통해 복잡한 조회 기능**을 제공합니다.
- 개발자는 SQL이 아닌 **JPQL로 객체를 대상으로 쿼리**를 작성합니다.
- JPA는 JPQL을 분석해서 **알맞은 SQL로 변환**한 뒤, DB에 전달합니다.

```apl
JPQL 작성 → JPA → SQL 변환 → DB 조회 → 결과를 Entity로 반환
```



### **JPQL 정리**

| 항목 | 설명                                              |
| ---- | ------------------------------------------------- |
| 정의 | 객체(Entity)를 대상으로 한 JPA의 쿼리 언어        |
| 목적 | SQL 대신 **객체 중심**으로 데이터 조회            |
| 특징 | SQL과 유사한 문법 + 테이블이 아닌 **엔티티 기반** |
| 관계 | JPA에서 JPQL은 **검색(조회)**을 위한 필수 도구    |
