rootProject.name = "netplix2"
include("netplix-apps:app-api")
include("netplix-apps:app-batch")

include("netplix-adapters:adapter-http")
include("netplix-adapters:adapter-persistence")
include("netplix-adapters:adapter-redis")

include("netplix-core:core-domain")
include("netplix-core:core-port")
include("netplix-core:core-service")
include("netplix-core:core-usecase")

include("netplix-commons")