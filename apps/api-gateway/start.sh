(sleep 60; gradlew buildAndReload --continuous -PskipDownload=true -x Test)&
gradlew bootRun -PskipDownload=true