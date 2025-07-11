# 자바 ORM 표준 JPA 프로그래밍-기본편: 03. 영속성 관리



## 1. 영속성 컨텍스트 

영속성 컨텍스트란 **엔티티(Entity)를 영구적으로 저장하는 환경을 의미**합니다. 앞으로 학습하게 될 `EntitiyManager.persist(entity);` 코드를 통해 엔티티를 영속화(영속성 컨텍스트에 저장)할 수 있어요. 

좀 더 쉽게 말하면,

- `EntityManager`는 **메모리 상에서 관리하는 가상의 저장소**로 자바 객체를 저장합니다.
- JPA는 이 공간을 이용해서 DB와의 직접적인 통신 없이도 객체 상태를 추적하고, 변경된 내용을 나중에 DB에 반영할 수 있어요.

```java
Member member = new Member();         // 비영속 상태
em.persist(member);                  // 영속성 컨텍스트에 저장 (영속 상태)
```

- `persist()` 메서드는 객체를 **영속성 컨텍스트에 등록**합니다.
- 이 순간부터 JPA는 이 `member` 객체를 **"관리 대상"**으로 삼고, 상태를 추적하게 돼요.



### 1.1 엔티티 팩토리 매니저와 엔티티 매니저 

![image-20250711201737734](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711201737734.png)

웹 애플리케이션을 개발한다고 하면, 고객의 **요청이 올 때마다 `EntityManagerFactory`를 통해 `EntityManager`를 생성해 배치합니다.** `EntityManager`는 내부적으로 데이터베이스 커넥션 풀(Connection Pool)을 사용해 DB와 통신합니다. 영속성 컨텍스트는 **논리적인 개념**이기 때문에 눈으로 직접 볼 수 없습니다. 따라서 ***`EntityManager`를 통해 영속성 컨텍스트에 접근**해야 합니다.

**`EntityManagerFactory`**

- 애플리케이션 실행 시 **딱 하나만 생성됨** (DB 설정을 기준으로)
- `EntityManager`를 생성하는 주체

**`EntityManager`**

- 사용자의 **요청(트랜잭션)이 올 때마다 새로 만들어지고, 작업이 끝나면 닫힘**
- `EntityManager`를 통해서 영속성 컨텍스트에 접근



### 1.2 J2SE 환경

J2SE(Java 2 Standard Edition)는 기본적인 Java 개발 및 실행 환경입니다. Java 언어를 이용하여 애플리케이션 혹은 컴포넌트 등을 개발하고 실행할 수 있는 환경을 제공하는 플랫폼입니다. 쉽게 말하자면 J2SE는 순수 자바 환경을 의미하고 있어요. 이러한 J2SE 환경에서 `EntityManager` 생성을 살펴보겠습니다.

![image-20250711205550225](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711205550225.png)

- `EntityManager` 하나를 만들면, 그것만을 위한 **영속성 컨텍스트가 1:1**로 생성됩니다.

```css
[EntityManager1] → [PersistenceContext1]
[EntityManager2] → [PersistenceContext2]
```

즉, 각각의 EntityManager는 독립된 저장소를 가지게 됩니다. 테스트 환경이나 간단한 자바 앱에서 사용돼요.즉, 각각의 EntityManager는 독립된 저장소를 가지게 됩니다. 테스트 환경이나 간단한 자바 앱에서 사용돼요.



### 1.3 J2EE

J2EE는 현재 Java EE로 발전했으며, 클라우드 환경 및 마이크로서비스 아키텍처를 지원하는 방향으로 계속 진화하고 있습니다. 쉽게 말하자면 Spring 환경이에요. 이어서 J2EE에서 `EntityManager` 생성을 살펴보겠습니다.

- 컨테이너가 관리하는 환경에서는, 여러 `EntityManager`들이 **하나의 영속성 컨텍스트를 공유(N:1)** 합니다.

![image-20250711210014605](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711210014605.png)

```css
[EntityManager1] 
       ↓
[공유된 PersistenceContext]
       ↑
[EntityManager2]
```

웹 요청마다 새로운 EntityManager가 생성되더라도, 내부적으로는 **동일한 영속성 컨텍스트를 공유**함으로써 **트랜잭션 내에서 객체의 일관성이 유**지됩니다.



### 1.4 정리

| 용어                   | 설명                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `영속성 컨텍스트`      | 엔티티를 저장하고 관리하는 메모리 공간                       |
| `EntityManager`        | 영속성 컨텍스트에 접근하는 통로, 개발자가 직접 사용          |
| `EntityManagerFactory` | EntityManager를 만들어주는 공장 역할. 앱 실행 시 하나만 생성 |
| `persist()`            | 객체를 영속성 컨텍스트에 등록하여 JPA가 관리하게 함          |

영속성 컨텍스트는 단순히 엔티티를 저장하고 관리하는 메모리 공간이 아니라, **1차 캐시(L1 Cache), 변경 감지(Dirty Checking), 쓰기 지연(Write Behind), 동일성 보장(Identity Preservation)** 같은 다양한 핵심 기능의 중심이 되는 메모리 공간이기 때문입니다.



## 2. 엔티티의 생명주기

> **♻️엔티티의 생명주기**란 엔티티 객체가 생성되어서 삭제되기까지 JPA 내부에서 어떤 상태로 관리되는지를 의미해요. 여기에서 핵심은 **"어떤 시점에 영속성 컨텍스트와 연결(등록)되느냐에 따라 엔티티의 상태가 달라진다"**는 거에요.



### 2.1 엔티티 생명주기(Entity Lifecycle) 4단계

![image-20250711211204166](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711211204166.png)

| 단계  | 상태 이름                 | JPA가 관리하나요? | 설명 요약                                                    |
| ----- | ------------------------- | ----------------- | ------------------------------------------------------------ |
| 1단계 | **비영속 (new/trasient)** | ❌ 관리 X          | 단순히 `new`로 만든 자바 객체<br />- 영속성 컨텍스트와 전혀 관계가 없는 **새로운** 상태 |
| 2단계 | **영속 (managed)**        | ✅ 관리 O          | `persist()` 호출 후 JPA가 관리하는 상태<br />- 영속성 컨텍스트에 **관리**되는 상태 |
| 3단계 | **준영속 (detached)**     | ❌ 관리 X          | 원래 관리되던 객체가 JPA의 손을 떠난 상태<br />- 영속성 컨텍스트에 저장되었다가 **분리**된 상태 |
| 4단계 | **삭제 (removed)**        | ✅ (삭제 예약)     | 삭제 명령이 내려진 상태, commit 시 DB에서 삭제<br />- **삭제**된 상태 |



### 2.2 비영속(new/trasient)

단순히 `new` 키워드로 객체를 만들기만 한 상태예요. **아직 DB랑은 전혀 관계가 없고, 영속성 컨텍스트도 이 객체를 모릅니다.**

```java
Member member = new Member();         // 비영속 상태
member.setId("member1");
member.setUsername("철수");
```

- 이 상태에서는 `em.find()`로 못 찾고, `commit()`과도 상관없이 무시됨
- 📦 그냥 메모리에만 있는 일반 객체!(영속성 컨텍스트 메모리 공간이 아니라 힙 메모리 공간에 있어요!)



### 2.3  2단계: **영속 (managed)**

`em.persist(entity)`를 호출하면, JPA는 이 객체를 **영속성 컨텍스트에 등록**해서 **'관리'**하기 시작해요. 
이제부터 JPA는 이 객체의 **변화도 감지**하고, **DB에 반영**할 준비를 합니다.

```java
EntityManager em = emf.createEntityManager();
em.getTransaction().begin(); // 트랜잭션 시작

em.persist(member);      // persist(): 영속 상태로 등록
em.getTransaction().commit(); // commit(): 실제로 DB가 변경되는 시점
```

영속(managed)된 객체는

1. **변경 감지되고,**
2. **1차 캐시 등록된 상태이고,**
3. **동일성 보장하고,**
4. **쓰기 지연되는,**

**JPA가 진짜 일을 시작하는 상태입니다!**



### 2.4 준영속 (detached)

영속 상태였던 객체를 JPA의 관리 대상에서 **"분리(detach)"**시킵니다. 이제 JPA는 분리된 객체가 바뀌든 말든 신경 쓰지 않아요.

```java
em.detach(member);   // 준영속 상태
```

또는 `EntityManager` 안에 객체를 모두 초기화할 수도 있어요. 

```java
em.clear();          // 모든 엔티티 준영속 상태로
```

`member` 객체는 여전히 힙 메모리에 있지만,🔌 **JPA와 연결이 끊긴 상태입니다.** 비유하자면, 준영속은 **회사에서는 퇴사했지만**, 집에는 여전히 있는 사람 같아요. 즉, 메모리에는 있지만 **JPA 회사에서는 더 이상 관리 대상이 아닙니다!**



###  2.5  **삭제 (removed)**

`em.remove(entity)`를 호출하면 이 객체는 **삭제 예정 상태**가 됩니다. 트랜잭션이 커밋되면 진짜로 DB에서도 사라져요.

```
em.remove(member);   // 삭제 상태
```

- 아직은 DB에서 삭제되지 않음
- `commit()` 하는 순간 실제 삭제됨



### 2.6 정리

| 상태   | 외우기 쉬운 포인트                  |
| ------ | ----------------------------------- |
| 비영속 | 단순히 `new`로 만든 객체            |
| 영속   | `persist()` 후 JPA가 관리           |
| 준영속 | `detach()`로 JPA 연결 끊김          |
| 삭제   | `remove()` 호출, 커밋하면 진짜 삭제 |

- `commit()`: 실제로 DB가 변경되는 시점
- `flush()`: 지금까지의 변경 내용을 DB에 미리 반영(단, 트랜잭션이 아직 열린 상태로 `rollback()` 하면 취소 가능)
- `find()`:  엔티티 조회(먼저 **1차 캐시**(영속성 컨텍스트)에서 찾고, 없으면 **DB에서 SELECT 쿼리** 실행함)
- `merge()`: 준영속 상태의 객체를 다시 수정하고 저장



## 3. 1차 캐시

**1차 캐시는 영속성 컨텍스트 내부에 있는 Map 구조의 저장소**예요. JPA는 여기에 **영속 상태의 엔티티 객체를 저장**해 두고, `find()` 할 때 먼저 이곳에서 찾습니다. 비유하자면, "JPA는 DB를 뒤지기 전에, 자기 책상 서랍(1차 캐시)을 먼저 뒤져본다" 볼 수 있어요.

### 3.1 1차 캐시 동작

![image-20250711213347056](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711213347056.png)

```java
Member member = new Member(); // 비영속
member.setId("member1");
member.setUsername("철수");

em.persist(member);               // 영속: 1차 캐시(영속성 컨텍스트)에 저장됨

Member find1 = em.find(Member.class, "member1"); // 캐시에서 바로 조회 (DB X)
Member find2 = em.find(Member.class, "member1"); // 역시 캐시에서 조회
```

- **동일성 보장(Identity Preservation)**: `find1 == find2` → `true` → 두 객체는 메모리 주소까지 동일해요! 따라서 1차 캐시로 반복 가능한 읽기(REPEATABLE READ) 등급의 트랜잭 션 격리 수준을 데이터베이스가 아닌 애플리케이션 차원에서 제공합니다.



![image-20250711213653676](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711213653676.png)

```java
// 1차 캐시에 없으므로 DB 조회
em.persist(new Member("member1", "철수"));

// 1차 캐시 조회 → SQL X
Member m1 = em.find(Member.class, "member1");

// DB 조회 → SQL 실행됨
Member m2 = em.find(Member.class, "member2");
```



### **3.2  1차 캐시의 장점**

| 기능                      | 설명                                              |
| ------------------------- | ------------------------------------------------- |
| ✅ 반복 조회 최적화        | 같은 엔티티를 여러 번 조회해도 DB에 부담을 안 줌  |
| ✅ 객체 동일성 보장        | 같은 ID면 항상 같은 인스턴스를 반환               |
| ✅ 변경 감지 성능 향상     | 변경 전후 상태를 1차 캐시에서 관리 가능           |
| ✅ 트랜잭션 격리 수준 강화 | 애플리케이션 차원에서 'REPEATABLE READ' 효과 제공 |



### 3.3  정리

- 1차 캐시는 **영속성 컨텍스트 내부**에 있고, `Map<id, Entity>` 형태로 구성됩니다.
- `em.find()`는 항상 1차 캐시를 먼저 보고, 없으면 DB에서 조회합니다.
- `persist()`한 객체는 자동으로 1차 캐시에 들어갑니다.
- 동일한 엔티티는 항상 **동일 객체**로 보장됩니다.(`==` 비교 가능)



## 4. 트랜잭션을 지원하는 쓰기 지연

JPA는 `persist()` 같은 메서드를 호출해도 **바로 DB에 SQL을 실행하지 않아요.**  대신 내부의 **쓰기 지연 저장소**(SQL 저장소)에 모아뒀다가, **트랜잭션 커밋 시점에 한꺼번에 실행**합니다. 비유하자면 **"주문을 하나하나 실시간으로 발송하지 않고, 장바구니에 다 담아두었다가 → 결제 버튼(커밋) 누를 때 한꺼번에 처리하는 것"**과 같습니다.



### 4.1 쓰기 지연 동작 과정

영속성 컨텍스트의 구성 요소는 1차 캐시(`Map<@Id, Entity>`), 스냅샷 저장소, 쓰기 지연 SQL 저장소가 있습니다. 간단하게 살펴보고 쓰기 지연에 대해 이어서 공부하겠습니다.

- **1차 캐시(`Map<@Id, Entity>`)**: 객체 저장
- **스냅샷 저장소**: 변경 감지를 위한 초기 상태 저장
- **쓰기 지연 SQL 저장소**: 실행 대기 SQL 모음(INSERT, UPDATE, DELTE)

![image-20250711214048657](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711214048657.png)

**`em.persist(memberA)` → `em.persist(memberB)` 실행 시**

 **1. `em.persist(memberA);`**

- `memberA` 엔티티를 `persist()` 하면 JPA는 즉시 DB에 INSERT하지 않고, 다음 두 작업을 수행합니다.

  **① INSERT SQL 생성**:  `SQL INSERT A` 구문이 **쓰기 지연 SQL 저장소**에 저장됨 (아직 실행은 안 됨)

  **② 1차 캐시에 저장**: `memberA` 객체가 영속성 컨텍스트의 1차 캐시에 등록됨

**2. `em.persist(memberB);`**

- 똑같이 `memberB`도 `persist()` 하면서 다음 작업이 이어집니다.

  **① INSERT SQL 생성**: `쓰기 지연 저장소`에 `SQL INSERT B` 저장

  **② 1차 캐시에 저장**: `"memberB"`도 1차 캐시에 추가됨

**3. 상황 정리**

- 두 개의 persist는 **DB에 아무 작업도 보내지 않음!**
- 대신, **쓰기 지연 SQL 저장소**와 **1차 캐시**에만 반영

![image-20250711214126294](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711214126294.png)

**`transaction.commit()` 시**

**1. `commit()` 호출**

- 이제 트랜잭션을 커밋합니다. 이 시점에서 **쓰기 지연 저장소에 쌓인 SQL들을 처리**해야 해요.

**2. flush 발생**

- `flush()`는 `commit()` 호출에 의해 내부적으로 자동 호출됩니다.
- 따라서 `쓰기 지연 저장소`의 SQL들을 하나씩 꺼내 **DB에 INSERT 실행**합니다

```sql
-- 실행되는 SQL
INSERT INTO member ... -- memberA
INSERT INTO member ... -- memberB
```

**4. 진짜 commit 수행**

- flush가 끝나면 이제 트랜잭션이 **진짜로 커밋**되어 DB는 해당 내용을 **확정 저장**합니다.

**전체 흐름 정리 (그림 기반 순서)**

```scss
[Step 1] em.persist(memberA); → SQL 생성, 1차 캐시에 저장
[Step 2] em.persist(memberB); → SQL 생성, 1차 캐시에 저장
[Step 3] transaction.commit(); → flush()로 SQL 실행 → commit()
```

👉 JPA는 성능을 위해 **트랜잭션 끝날 때까지 기다렸다가 한꺼번에 SQL을 날리는 전략**을 씁니다.



### **4.2  정리**

| 단계        | 작업 내용                                      |
| ----------- | ---------------------------------------------- |
| `persist()` | DB에 즉시 INSERT 안 함, SQL 저장소에만 저장    |
| `flush()`   | 저장소에 있는 SQL을 DB에 보냄                  |
| `commit()`  | 트랜잭션을 실제로 커밋 (데이터 확정)           |
| 1차 캐시    | persist된 엔티티는 영속성 컨텍스트 안에 보관됨 |

👉**쓰기 지연 SQL 저장소는, 영속성 컨텍스트 내부에서 SQL들을 일시적으로 보관하는 공간이며, flush 또는 commit 시 DB에 한꺼번에 전송하는 역할을 합니다.**



## 5. 변경 감지

**변경 감지((Dirty Checking)란**, **영속 상태의 엔티티 객체의 값이 변경되었는지를 JPA가 자동으로 감지하여 UPDATE SQL을 생성하는 기능**입니다. 즉, `setName()`, `setAge()`처럼 단순히 **객체의 값을 바꾸는 것만으로도 DB 업데이트가 되는 것**이에요! 참고로 변경 감지는 **"영속 상태의 객체"에만 적용**됩니다.

### 5.1 변경 감지  중요성

- 우리가 직접 `em.update()` 같은 메서드를 호출할 필요가 없어요.
- JPA가 **변경 여부를 자동으로 감지**하고, **업데이트 SQL도 자동으로 생성**합니다.
- 결과적으로 **코드를 단순하고 객체지향적으로 작성**할 수 있어요.



### 5.2 변경 감지 동작 과정

```java
EntityManager em = emf.createEntityManager();
EntityTransaction tx = em.getTransaction();

tx.begin();  // [트랜잭션] 시작

Member member = em.find(Member.class, "memberA"); // 영속 상태

// 값만 바꿈! (update() 호출 X)
member.setUsername("newName");
member.setAge(20);

//  //em.update(member) 이런 코드가 있어야 하지 않을까?

tx.commit();  // 변경 감지 → UPDATE SQL 자동 실행: [트랜잭션] 커밋
```

![image-20250711215814807](C:\Users\piay8\AppData\Roaming\Typora\typora-user-images\image-20250711215814807.png)

**1. `flush()` 호출**

- 트랜잭션 커밋 시 또는 JPQL 실행 시 JPA가 **flush()** 를 자동으로 호출합니다.
- 이 시점에 **변경 감지 로직**이 작동하기 시작해요.

**2. 엔티티와 스냅샷 비교**

- 영속성 컨텍스트의 **1차 캐시**에는 각 엔티티가 저장되어 있고,
- JPA는 엔티티를 처음 로딩할 때 **스냅샷(초기 상태 복사본)**도 함께 저장해 둡니다.

👀 이제 flush가 호출되면… **"현재 엔티티 값" vs "스냅샷 값" 을 비교**합니다. 값이 달라졌다면? → 변경된 것으로 감지!

**스냅샷👉** JPA는`find()`나 `persist()` 할 때, 해당 엔티티의 **초기값 복사본**을 만들어 내부에 저장합니다. 이걸 **스냅샷(Snapshot)** 이라고 해요. 나중에 flush 시점에 이 스냅샷과 **현재 엔티티의 필드값**을 비교해서 달라졌는지 확인합니다.

**3. UPDATE SQL 생성**

- 변경이 감지되면, 해당 엔티티에 대한 **UPDATE SQL**을 생성합니다.
- 하지만 이 SQL도 **바로 실행되는 게 아니라**,  **쓰기 지연 SQL 저장소에 우선 보관**됩니다.

🛑 아직 DB에는 전송되지 않았어요!

### **4. flush 수행 → SQL 전송**

- 이제 flush가 본격적으로 **쓰기 지연 SQL 저장소에 쌓인 SQL들을 DB에 전송**합니다.
- `SQL UPDATE A` 같은 쿼리가 **실제 DB로 날아갑니다.**

### **5. commit**

- SQL 실행이 끝나고 나면, 트랜잭션이 **커밋(commit)** 되어 **변경사항이 DB에 확정 저장**됩니다.

**6. 요약**

| 단계                      | 설명                          |
| ------------------------- | ----------------------------- |
| ① flush() 호출            | 커밋 또는 JPQL 전에 자동 실행 |
| ② 스냅샷 비교             | 변경 여부 판단                |
| ③ UPDATE SQL 생성         | 변경된 필드 기반으로          |
| ④ SQL 저장소에서 SQL 실행 | DB에 전송                     |
| ⑤ commit()                | 트랜잭션 종료 및 DB 확정      |



### 5.3 변경 감지가 **발생하지 않는 경우**

| 경우               | 설명                                                   |
| ------------------ | ------------------------------------------------------ |
| 준영속 상태        | `detach()` 된 객체는 JPA가 관리하지 않으므로 감지 불가 |
| 트랜잭션 없이 수정 | 트랜잭션 없이 변경만 하고 끝나면 SQL 안 날아감         |
| 실제 값이 같을 때  | 값을 바꿨지만 원래와 동일하면 UPDATE 안 됨             |



### 5.4 변경 감지 vs 병합(merge)

`merge()`는 **준영속 상태**의 엔티티를 JPA가 다시 **영속 상태로 되돌려서** 변경 사항을 **DB에 반영하도록 만드는 메서드**예요. 아래 코드로 `merge()`를 살펴보겠습니다.

```java
// 1. 영속 상태로 저장
Member member = em.find(Member.class, "memberA");
em.detach(member);   // 2. 이제 준영속 상태

member.setUsername("변경된 이름"); // 3. 값은 바꿨지만...

em.merge(member);    // 4. 병합! (다시 관리 대상이 됨)
```

👉 이때 `merge()`는 내부적으로 다음과 같은 과정을 수행해요.

1. 파라미터로 전달된 준영속 엔티티의 ID를 보고,
2. **DB 또는 1차 캐시에서 "같은 ID"를 가진 영속 엔티티를 새로 찾거나 생성**
3. 찾았다면 영속 엔티티에 준영속 엔티티의 데이터를 **복사(copy)**
4. 그 **복사된 영속 객체**가 DB 반영 대상이 됨

즉, `merge()`는 **전달받은 객체 자체를 재활용하지 않습니다!** **새로운 영속 객체를 만들어서 그걸 DB에 반영**합니다.



**짚고 넘어가기!**

> “찾은 영속 엔티티에 준영속 객체의 데이터를 복사한다면, 결국 영속 객체를 재사용한 거 아닌가요?”

✔️ **맞습니다! "영속 객체"는 재사용됩니다.**

하지만 여기서 주의할 점은:

> ❌ **`merge(entity)`로 넘긴 그 `entity` 객체 자체는 절대 재사용되지 않습니다.**

`merge()`는 **준영속 객체는 버리고**, **기존의 영속 객체를 찾아서 그 안에 값만 복사**합니다. 
**그리고 그 영속 객체만 계속 관리 대상이 됩니다.**



| 구분 | 변경 감지           | 병합(merge)                        |
| ---- | ------------------- | ---------------------------------- |
| 전제 | 영속 상태           | 준영속 상태                        |
| 방식 | 객체 변경만 하면 됨 | `em.merge()` 호출 필요             |
| 성능 | 빠르고 가볍다       | 느리고 무겁다 (새로운 객체 생성됨) |

👉 **JPA의 철학은 객체처럼 편하게 쓰도록 돕지만**, 그만큼 **내부적으로 어떤 상태인지 정확히 알아야 한다는 책임도 존재**합니다. 따라서 이 표는 단순한 문법 비교가 아니라, **"엔티티의 상태를 정확히 이해하고, 상황에 맞는 전략을 선택하라"**는 JPA의 철학이 담긴 전략 가이드입니다.



### **5.5 변경 감지 정리**

| 항목             | 설명                                                 |
| ---------------- | ---------------------------------------------------- |
| 무엇인가요?      | 객체의 값 변경을 JPA가 자동 감지하여 UPDATE SQL 생성 |
| 어떻게 하나요?   | 스냅샷(초기 상태)과 현재 상태를 비교                 |
| 언제 발생하나요? | 트랜잭션 커밋 시점에 flush() 통해 발생               |
| 장점은?          | update 호출 없이 객체처럼 코딩하면 DB까지 자동 반영  |



## 6. 플러시

**플러시(Flush)** 는 **영속성 컨텍스트에 있는 변경 내용을 데이터베이스에 동기화**하는 작업입니다. 플러시의 가장 중요한 점은  **트랜잭션은 그대로 유지되고, DB에 반영만 할 뿐 커밋은 하지 않아요.**

```java
em.persist(memberA); // INSERT SQL 생성, 저장소에 보관
em.flush();          // INSERT SQL 실제로 DB에 전송

// 하지만 아직 트랜잭션 커밋되지 않음
```



### 6.1 플러시 발생 시점

| 발생 시점                  | 설명                                             |
| -------------------------- | ------------------------------------------------ |
| **`em.flush()` 호출**      | 수동 플러시                                      |
| **`transaction.commit()`** | 커밋 전에 자동 호출                              |
| **JPQL 실행 전**           | DB와 결과가 일치하도록 보장하기 위해 자동 플러시 |



### 6.2 flush가 하는 일

1. **변경 감지(Dirty Checking)** 수행
2. 변경된 엔티티 → 쓰기 지연 SQL 저장소에 등록
3. 저장소의 SQL들을 **DB에 실행 (INSERT / UPDATE / DELETE)**
4. 하지만 1차 캐시는 그대로 유지됨



### **6.3 flush vs commit 차이**

| 항목          | flush    | commit         |
| ------------- | -------- | -------------- |
| SQL 실행      | ✅ 실행함 | ✅ 실행함       |
| 트랜잭션 종료 | ❌ 안 함  | ✅ 종료함       |
| 1차 캐시 유지 | ✅ 유지됨 | 🔄 보통 clear됨 |



###  **6.4 FlushMode 옵션**

| 옵션            | 설명                             |
| --------------- | -------------------------------- |
| `AUTO` (기본값) | 커밋이나 JPQL 실행 시 자동 flush |
| `COMMIT`        | 오직 커밋 시에만 flush 발생      |

```java
em.setFlushMode(FlushModeType.COMMIT);
```



## 7. 준영속 상태

**준영속 상태(Detached)**란, 원래는 **영속 상태였던 엔티티가 JPA의 관리에서 분리된 상태**를 말합니다.



### 7.1 준영속 특징

- 더 이상 **변경 감지가 안 됨**
- 더 이상 **쓰기 지연 SQL 저장소에도 영향 없음**
- 하지만 **객체는 여전히 메모리에 존재**



**예시 코드**

```java
Member member = em.find(Member.class, "member1"); // 영속 상태
em.detach(member); // 준영속 상태
member.setUsername("변경");  // 변경해도 반영 안 됨!
em.getTransaction().commit(); // SQL 안 날아감
```



### **7.2 준영속 상태 만드는 3가지 방법**

| 방법                | 설명                      |
| ------------------- | ------------------------- |
| `em.detach(entity)` | 해당 엔티티만 분리        |
| `em.clear()`        | 모든 엔티티를 분리        |
| `em.close()`        | 영속성 컨텍스트 자체 종료 |



### **7.3 다시 영속화하려면?**

- `em.merge()`를 사용해야 합니다. 준영속 객체의 데이터가 **영속 객체로 복사**되어 다시 관리됩니다.



### **7.4 준영속 상태 요약**

| 항목                   | 설명           |
| ---------------------- | -------------- |
| 영속성 컨텍스트와 관계 | ❌ 끊어짐       |
| 변경 감지              | ❌ 안 됨        |
| flush 영향             | ❌ 없음         |
| 다시 관리하려면        | `merge()` 필요 |



### **7.5 정리**

| 주제       | 핵심 개념                                                    |
| ---------- | ------------------------------------------------------------ |
| **flush**  | 영속성 컨텍스트의 변경 사항을 DB에 반영하지만 트랜잭션은 유지됨 |
| **준영속** | 영속 상태에서 분리된 객체, 더 이상 JPA의 감시 대상이 아님    |

- `flush()`는 **변경 내용을 실제 DB로 미리 반영하고 싶을 때**
- `detach()`나 `clear()`로 준영속 상태가 되면 **객체는 살아있지만 JPA는 더 이상 관심 없음**