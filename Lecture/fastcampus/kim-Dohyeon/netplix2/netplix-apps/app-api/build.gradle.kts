dependencies {
    implementation(project(":netplix-core:core-usecase"))
    implementation(project(":netplix-commons"))

    runtimeOnly(project(":netplix-core:core-service"))
    runtimeOnly(project(":netplix-adapters:adapter-http"))

    implementation("org.springframework.boot:spring-boot-starter-web")
}