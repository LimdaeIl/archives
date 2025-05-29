dependencies {
    implementation(project(":netplix-core:core-usecase"))
    implementation(project(":netplix-core:core-port"))

    runtimeOnly(project(":netplix-adapters:adapter-http"))

    implementation("org.springframework:spring-context")
}
