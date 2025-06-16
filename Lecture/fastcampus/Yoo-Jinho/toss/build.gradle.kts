group = "com.book"
version = "0.0.1-SNAPSHOT"

plugins {
	java
	id("org.springframework.boot") version "3.5.0"
	id("io.spring.dependency-management") version "1.1.7"
	id("com.epages.restdocs-api-spec") version "0.19.4"
	id("org.hidetake.swagger.generator") version "2.18.2"
}

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.projectlombok:lombok")
	compileOnly("org.projectlombok:lombok")

//    developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("com.h2database:h2")
	runtimeOnly("com.mysql:mysql-connector-j")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("com.google.code.gson:gson")
	testAnnotationProcessor("org.projectlombok:lombok")
	testImplementation("org.projectlombok:lombok")

	// Retrofit and OkHttp
// https://mvnrepository.com/artifact/com.squareup.retrofit2/retrofit
	implementation("com.squareup.retrofit2:retrofit:3.0.0")
	implementation("com.squareup.retrofit2:converter-jackson:3.0.0")
	implementation("com.squareup.retrofit2:converter-gson:3.0.0")
	implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.19.0")
	implementation("com.google.code.gson:gson")

	// API Docs
	testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
	testImplementation("org.springframework.restdocs:spring-restdocs-asciidoctor")
	testImplementation("com.epages:restdocs-api-spec-mockmvc:0.19.4")

	// Mockito
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.boot:spring-boot-starter-actuator")
	testImplementation("org.mockito:mockito-core:3.3.0")
	testImplementation("com.squareup.retrofit2:retrofit-mock:2.10.0")


}

tasks.withType<Test> {
	useJUnitPlatform()
}
