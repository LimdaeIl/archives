# 자바 ORM 표준 JPA 프로그래밍-기본편: 01. JPA 소개



## 1. SQL 중심적인 개발의 문제점

## 1.1 SQL에 의존하는 개발

현대 애플리케이션은 일반적으로 **Java, Scala, C#** 같은 객체 지향 언어로 작성되며, 데이터 저장소로는 대부분 **관계형 데이터베이스(RDB)**(예: MySQL, Oracle, PostgreSQL 등)를 사용합니다. 하지만 객체를 RDB에 저장하기 위해선 단순히 `저장하기` 버튼 하나로 해결되지 않습니다. **데이터 생성, 조회, 수정, 삭제(CRUD)**를 위해선 반드시 SQL을 직접 작성해야 합니다.



### **SQL 기반 개발의 한계**

- **반복적인 SQL 작성**
  객체의 필드가 추가되면 관련된 모든 SQL에도 수정을 가해야 합니다.
- **SQL 유지보수 부담**
  수많은 쿼리들을 일일이 관리해야 하므로 생산성과 유지보수가 떨어집니다.



### **객체와 RDB의 패러다임 불일치**

객체 지향과 관계형 DB는 기본 철학부터 다릅니다. 이로 인해 **객체와 테이블 사이의 간극을 매꾸는 데에 많은 작업이 필요**하며, 이를 '**패러다임 불일치'**라고 합니다. JPA가 등장한 이유는 바로 이 간극을 줄이기 위해서입니다.

![SQL 변환](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711154002755.png)



### **주요 패러다임 불일치 사례**

### **상속 (Inheritance)**

**객체 지향 언어**에서는 상속을 통해 코드 재사용과 구조화를 추구하지만, **RDB**에는 상속이라는 개념이 없습니다.

```java
class Item { 
  Long id;
  String name;
}

class Book extends Item { // Item 상속
  String author;
}
```

위의 자바 코드를 DB 저장하려면 다음 절차를 수행해야 합니다.

1. `ITEM` 테이블과 `BOOK` 테이블로 나누어 저장
2. `INSERT` 시 각각 테이블에 나눠서 저장
3. `SELECT` 시 `JOIN`을 통해 다시 조합해야 함

![image-20250711154346514](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711154346514.png)

보통 RDB에서는 오른쪽 그림처럼 **슈퍼타입(부모)과 서브타입(자식)**으로 나눠 테이블을 구성합니다. 이 방식을 사용하면 데이터를 분리해 뒀다가 필요할 때 조인해서 가져오고 다시 풀어둡니다. **이 과정은 상당히 복잡하기 때문에 실무에서 잘 사용하지 않으며 DB에 저장할 객체는 되도록 상속 관계를 사용하지 않습니다.**



**문제점 정리**

- 테이블 설계가 복잡해짐
- 객체 조립 및 분해 로직 필요
- 상속을 DB에 반영하는 건 개발자가 SQL로 직접 매핑해야 하므로 오류 가능성 ↑

**결론:** RDB에서는 상속을 표현하기 어렵고, 비효율적이며, 복잡해짐



### **연관관계 (Association)**

- **객체:** 참조(Reference)를 통해 다른 객체에 접근
-  **DB:** 외래 키(Foreign Key)와 JOIN을 통해 연관된 데이터를 조회

![image-20250711154857994](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711154857994.png)

**객체 모델링**

- 객체는 **참조**를 사용: `member.getTeam()`

```java
class Member {
  Long id;
  Team team; // 객체 참조
  String name;
}

class Team {
  Long id;
  String name;
}
```



**DB 모델링**

- 테이블은 **외래 키**를 사용: `JOIN ON M.TEAM_ID = TEAM.ID`

```sql
-- MEMBER 테이블에 TEAM_ID 컬럼 존재
JOIN ON MEMBER.TEAM_ID = TEAM.ID
```



**개발 현실**

- 편의상 `teamId`만 두고 사용하게 됨
- 객체답게 설계하려면 `Team team`으로 참조하고 복잡한 SQL JOIN을 매번 직접 작성해야 함

**결과:**

- 객체 간 관계 표현이 SQL 중심의 설계로 제한됨
- 객체 모델링을 포기하거나 SQL 중심으로 돌아서게 됨



### **탐색 범위(Navigation)**

![image-20250711155410649](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711155410649.png)

**객체:** 연관된 객체를 자유롭게 탐색할 수 있음 (객체 그래프 탐색)
 예: `member.getTeam().getCompany().getLocation()`

**RDB:** JOIN한 테이블까지만 접근 가능
 → 초기 SQL에 포함되지 않은 테이블은 접근 불가

```SQL
SELECT M.*, T.*
FROM MEMBER M
	JOIN TEAM T ON M.TEAM_ID = T.TEAM_ID;
```

→ 이 경우 `member.getOrder()`는 null이 됨 (ORDER 테이블 미포함)



**문제점**

- 엔티티 객체가 완전하지 않음
- 개발자는 해당 객체가 어디까지 탐색 가능한지 매번 신경 써야 함
- 계층 간 신뢰가 무너짐 → 유지보수성 저하



### **동일성 비교**

**객체:** `==` 비교 시 같은 인스턴스는 true
 **RDB:** 같은 ID로 조회해도 매번 새로운 객체가 생성되므로 `==`는 false

```java
Member m1 = memberRepository.find("id100");
Member m2 = memberRepository.find("id100");
System.out.println(m1 == m2); // false
```

→ 같은 데이터를 가져와도 인스턴스가 다르면 동일하지 않다고 판단됨

이로 인해 **객체 간 동일성 비교**가 어려워지고, 참조 무결성에도 문제 발생 가능



**결론**

객체 지향 설계를 따르다 보면 아래와 같은 문제에 직면하게 됩니다.

| 문제      | 설명                                               |
| --------- | -------------------------------------------------- |
| 상속      | RDB에선 표현이 어렵고 JOIN 등 복잡한 SQL 필요      |
| 연관관계  | 참조 대신 ID를 사용하게 되어 객체 모델링 무너짐    |
| 탐색 범위 | SQL의 JOIN 범위만 탐색 가능. 객체 탐색 자유도 낮음 |
| 동일성    | 같은 ID라도 인스턴스가 다르면 동일하다고 판단 불가 |



###  **해결책**

**JPA(Java Persistence API)**는 이러한 **객체-관계 불일치(ORM impedance mismatch)** 문제를 해결하기 위해 등장한 기술입니다. 
객체 지향적 모델링을 유지하면서도, SQL을 직접 작성하지 않고, 매핑, 탐색, 캐싱, 동일성 비교 등을 자동화해 줍니다.



## 2. JPA 소개

### **JPA란?**

**JPA(Java Persistence API)**는 자바 진영의 **표준 ORM(Object-Relational Mapping) 기술 명세**입니다. 자바 객체와 관계형 데이터베이스(RDB) 간의 매핑을 자동화하여, SQL 작성 없이도 객체를 DB에 저장하고 조회할 수 있도록 지원합니다.



### **ORM(Object-Relational Mapping)이란?**

- 객체(예: Java의 클래스)와 관계형 DB 테이블 간의 **불일치(패러다임 차이)**를 해결하기 위한 기술
- 개발자는 객체지향적으로 설계하고, ORM이 SQL 생성 및 매핑 작업을 대신 수행함

**이전 방식 (비-ORM)**

```java
String sql = "INSERT INTO MEMBER ...";
PreparedStatement pstmt = conn.prepareStatement(sql);
```

**ORM 방식 (JPA 사용 시)**

```java
em.persist(member); // 객체 저장
```



### **JPA의 동작 구조**

**JPA는 JDBC 위에서 동작하며**, SQL 생성부터 매핑까지 모든 과정이 **자동화**되어 있습니다.

**저장(persist)**

![image-20250711160909219](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711160909219.png)

1. `EntityManager.persist()` 호출
2. 엔티티 분석
3. 자동으로 `INSERT` SQL 생성
4. JDBC API 통해 DB에 저장

**조회(find)**

![image-20250711160943801](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711160943801.png)

1. `EntityManager.find()` 호출
2. `SELECT` SQL 자동 생성
3. JDBC로 DB 접근
4. `ResultSet → 엔티티`로 매핑 후 반환



### **JPA vs 다른 ORM (MyBatis, JDBC Template 등)**

| 항목          | JPA                     | MyBatis / JDBC Template |
| ------------- | ----------------------- | ----------------------- |
| SQL 작성      | 직접 작성 X (자동 생성) | 직접 작성 필요          |
| 객체 매핑     | 자동                    | 수동                    |
| 상속/연관관계 | 지원 (자동 처리)        | 직접 매핑               |
| 학습 난이도   | 높음                    | 중간                    |
| 생산성        | 매우 높음               | 낮음                    |



### **JPA의 표준과 구현체**

JPA는 인터페이스(표준 명세)이며, 이를 구현한 **구현체**가 필요합니다. JPA 구현체는 **Hibernate** (가장 널리 쓰임), EclipseLink, DataNucleus 등이 있습니다.

> Hibernate는 JPA 표준 명세를 만든 주체이기도 하며, 기능적으로도 거의 1:1 대응됩니다.



###  **JPA 주요 버전 요약**

| 버전           | 설명                                               |
| -------------- | -------------------------------------------------- |
| JPA 1.0 (2006) | 초기 버전, 기능 부족                               |
| JPA 2.0 (2009) | ORM의 대부분 기능 포함, Criteria API 도입          |
| JPA 2.1 (2013) | Stored Procedure 지원, Converter, EntityGraph 도입 |



### **객체-관계 패러다임 불일치 해결**

**상속**

- 복잡한 테이블 분리 및 JOIN 없이 `persist()` 한 줄로 해결

```java
// 개발자가 할 일
em.persist(book); // 내부적으로 ITEM, BOOK 테이블에 자동 저장
```

```sql
-- 나머지는 JPA가 처리
INSERT INTO ITEM ...
INSERT INTO ALBUM ...
```

**연관관계**

- 객체의 참조 관계(Member → Team)를 외래 키 관계로 자동 매핑

```java
member.setTeam(team); // 외래 키 자동 설정됨
em.persist(member);   // INSERT 시 JOIN 로직 필요 없음
```

**객체 그래프 탐색**

- 연관된 객체도 자유롭게 탐색 가능 → 계층 간 신뢰 보장

```java
Member member = em.find(Member.class, memberId);
member.getOrder().getDelivery(); // OK
```

**동일성 비교**

- 같은 트랜잭션 내에서 동일한 엔티티를 여러 번 조회해도 같은 인스턴스 반환

```java
Member m1 = em.find(Member.class, "id100");
Member m2 = em.find(Member.class, "id100");
System.out.println(m1 == m2); // true
```



### **성능 최적화 기능**

**1차 캐시 + 동일성 보장**

- 같은 트랜잭션 내에서 동일한 엔티티는 **캐시에서 재사용**됨
- SQL이 불필요하게 두 번 실행되지 않음

```java
Member m1 = em.find(Member.class, "100"); // SQL 실행
Member m2 = em.find(Member.class, "100"); // 캐시 조회
```

> **Repeatable Read 수준의 일관성 보장**
>  → DB Isolation Level이 낮아도 애플리케이션에서 높은 일관성을 확보 가능



**쓰기 지연(Transaction Write-Behind)**

- `persist()` 시점에 SQL 실행 X → **트랜잭션 커밋 시 한 번에 SQL 실행**
- INSERT 외에도 UPDATE, DELETE에도 적용 가능

```java
em.persist(m1); // SQL 안 날림
em.persist(m2); // SQL 안 날림
em.getTransaction().commit(); // 한꺼번에 SQL 실행
```

> 🔒 UPDATE / DELETE 시점엔 DB Lock이 걸릴 수 있으므로 **커밋 직전에 SQL 실행하여 성능 향상**



**지연 로딩(Lazy Loading) vs 즉시 로딩(Eager Loading)**

| 유형  | 설명                      | 장점                 | 단점               |
| ----- | ------------------------- | -------------------- | ------------------ |
| Lazy  | 실제 접근 시 SQL 실행     | 불필요한 데이터 지연 | N+1 문제 발생 가능 |
| Eager | 즉시 JOIN하여 데이터 로딩 | 빠른 조회            | 성능 저하 가능     |



```java
// Lazy
Team team = member.getTeam(); // 이 시점에 SELECT * FROM TEAM

// Eager
Member member = em.find(Member.class, id); 
// SELECT M.*, T.* FROM MEMBER M JOIN TEAM T ...
```

> ⚠️ 일반적으로는 **Lazy**를 기본으로 두고, 필요한 경우만 **Eager**를 설정



## **3. 요약 정리**

| 기능        | 전통 방식         | JPA 사용 시                           |
| ----------- | ----------------- | ------------------------------------- |
| SQL 작성    | 직접 작성         | 자동 생성                             |
| 엔티티 저장 | INSERT SQL 작성   | `em.persist(entity)`                  |
| 엔티티 조회 | SELECT SQL + 매핑 | `em.find(Entity.class, id)`           |
| 상속 처리   | 수동 JOIN         | 자동 처리                             |
| 연관관계    | 외래 키 직접 관리 | 객체 참조로 매핑                      |
| 성능 최적화 | 수동 튜닝 필요    | 1차 캐시, 쓰기 지연, Lazy 등 제공     |
| 동일성 비교 | `==` 비교 실패    | 같은 트랜잭션 내에서는 `==` 비교 성공 |