Running 'gradlew :app:assembleDebug' in /home/expo/workingdir/build/android
Downloading https://services.gradle.org/distributions/gradle-8.14.3-bin.zip
10%
20%.
30%.
40%.
50%.
60%
70
%.
80%
90%
100%
Welcome to Gradle 8.14.3!
Here are the highlights of this release:
 - Java 24 support
- GraalVM Native Image toolchain selection
- Enhancements to test reporting
- Build Authoring improvements
For more details see https://docs.gradle.org/8.14.3/release-notes.html
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.14.3/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build
> Configure project :expo-gradle-plugin:expo-autolinking-plugin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-autolinking/android/expo-gradle-plugin/expo-autolinking-plugin/build.gradle.kts:25:3: 'kotlinOptions(KotlinJvmOptionsDeprecated /* = KotlinJvmOptions */.() -> Unit): Unit' is deprecated. Please migrate to the compilerOptions DSL. More details are here: https://kotl.in/u1r8ln
> Configure project :expo-gradle-plugin:expo-autolinking-settings-plugin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-autolinking/android/expo-gradle-plugin/expo-autolinking-settings-plugin/build.gradle.kts:30:3: 'kotlinOptions(KotlinJvmOptionsDeprecated /* = KotlinJvmOptions */.() -> Unit): Unit' is deprecated. Please migrate to the compilerOptions DSL. More details are here: https://kotl.in/u1r8ln
> Task :gradle-plugin:settings-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :gradle-plugin:shared:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:pluginDescriptors
> Task :gradle-plugin:settings-plugin:pluginDescriptors
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:processResources
> Task :gradle-plugin:settings-plugin:processResources
> Task :gradle-plugin:shared:processResources NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:processResources NO-SOURCE
> Task :gradle-plugin:shared:compileKotlin
> Task :gradle-plugin:shared:compileJava NO-SOURCE
> Task :gradle-plugin:shared:classes UP-TO-DATE
> Task :gradle-plugin:shared:jar
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:compileKotlin
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:compileJava NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:classes UP-TO-DATE
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:jar
> Task :gradle-plugin:settings-plugin:compileKotlin
> Task :gradle-plugin:settings-plugin:compileJava NO-SOURCE
> Task :gradle-plugin:settings-plugin:classes
> Task :gradle-plugin:settings-plugin:jar
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:compileKotlin
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:compileJava NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:classes
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:jar
> Configure project :expo-dev-launcher-gradle-plugin
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/expo-dev-launcher-gradle-plugin/build.gradle.kts:25:3: 'kotlinOptions(KotlinJvmOptionsDeprecated /* = KotlinJvmOptions */.() -> Unit): Unit' is deprecated. Please migrate to the compilerOptions DSL. More details are here: https://kotl.in/u1r8ln
> Configure project :expo-module-gradle-plugin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/expo-module-gradle-plugin/build.gradle.kts:58:3: 'kotlinOptions(KotlinJvmOptionsDeprecated /* = KotlinJvmOptions */.() -> Unit): Unit' is deprecated. Please migrate to the compilerOptions DSL. More details are here: https://kotl.in/u1r8ln
> Task :gradle-plugin:react-native-gradle-plugin:checkKotlinGradlePluginConfigurationErrors
SKIPPED
> Task :expo-gradle-plugin:expo-autolinking-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-dev-launcher-gradle-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-module-gradle-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-module-gradle-plugin:pluginDescriptors
> Task :expo-dev-launcher-gradle-plugin:pluginDescriptors
> Task :expo-dev-launcher-gradle-plugin:processResources
> Task :expo-module-gradle-plugin:processResources
> Task :expo-gradle-plugin:expo-autolinking-plugin:pluginDescriptors
> Task :expo-gradle-plugin:expo-autolinking-plugin:processResources
> Task :gradle-plugin:react-native-gradle-plugin:pluginDescriptors
> Task :gradle-plugin:react-native-gradle-plugin:processResources
> Task :expo-gradle-plugin:expo-autolinking-plugin:compileKotlin
> Task :expo-gradle-plugin:expo-autolinking-plugin:compileJava
NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-plugin:classes
> Task :expo-gradle-plugin:expo-autolinking-plugin:jar
> Task :gradle-plugin:react-native-gradle-plugin:compileKotlin
> Task :gradle-plugin:react-native-gradle-plugin:compileJava NO-SOURCE
> Task :gradle-plugin:react-native-gradle-plugin:classes
> Task :gradle-plugin:react-native-gradle-plugin:jar
> Task :expo-dev-launcher-gradle-plugin:compileKotlin
> Task :expo-dev-launcher-gradle-plugin:compileJava NO-SOURCE
> Task :expo-dev-launcher-gradle-plugin:classes
> Task :expo-dev-launcher-gradle-plugin:jar
> Task :expo-module-gradle-plugin:compileKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/expo-module-gradle-plugin/src/main/kotlin/expo/modules/plugin/android/AndroidLibraryExtension.kt:9:24 'var targetSdk: Int?' is deprecated. Will be removed from library DSL in v9.0. Use testOptions.targetSdk or/and lint.targetSdk instead.
> Task :expo-module-gradle-plugin:compileJava NO-SOURCE
> Task :expo-module-gradle-plugin:classes
> Task :expo-module-gradle-plugin:jar
> Configure project :
[32m[ExpoRootProject][0m Using the following versions:
  - buildTools:  [32m36.0.0[0m
- minSdk:      [32m24[0m
  - compileSdk:  [32m36[0m
  - targetSdk:   [32m36[0m
  - ndk:         [32m27.1.12297006[0m
  - kotlin:      [32m2.1.20[0m
  - ksp:         [32m2.1.20-2.0.1[0m
> Configure project :app
 ℹ️  [33mApplying gradle plugin[0m '[32mexpo-dev-launcher-gradle-plugin[0m'
> Configure project :expo
Using expo modules
  - [32mexpo-constants[0m (18.0.10)
  - [32mexpo-dev-client[0m (6.0.18)
  - [32mexpo-dev-launcher[0m (6.0.18)
  - [32mexpo-dev-menu[0m (7.0.17)
- [32mexpo-dev-menu-interface[0m (2.0.0)
  - [32mexpo-json-utils[0m (0.15.0)
  - [32mexpo-manifests[0m (1.0.9)
- [32mexpo-modules-core[0m (3.0.25)
- [32mexpo-updates-interface[0m (2.0.0)
- [33m[📦][0m [32mexpo-application[0m (7.0.7)
  - [33m[📦][0m [32mexpo-asset[0m (12.0.9)
  - [33m[📦][0m [32mexpo-blur[0m (15.0.7)
  - [33m[📦][0m [32mexpo-camera[0m (16.1.11)
  - [33m[📦][0m [32mexpo-crypto[0m (15.0.7)
- [33m[📦][0m [32mexpo-document-picker[0m (14.0.7)
  - [33m[📦][0m [32mexpo-file-system[0m (19.0.17)
  - [33m[📦][0m [32mexpo-font[0m (14.0.9)
  - [33m[📦][0m [32mexpo-haptics[0m (14.1.4)
  - [33m[📦][0m [32mexpo-keep-awake[0m (15.0.7)
  - [33m[📦][0m [32mexpo-linear-gradient[0m (15.0.7)
  - [33m[📦][0m [32mexpo-linking[0m (8.0.8)
  - [33m[📦][0m [32mexpo-notifications[0m (0.32.13)
  - [33m[📦][0m [32mexpo-screen-orientation[0m (9.0.7)
  - [33m[📦][0m [32mexpo-sharing[0m (14.0.7)
- [33m[📦][0m [32mexpo-splash-screen[0m (0.30.10)
- [33m[📦][0m [32mexpo-sqlite[0m (16.0.9)
- [33m[📦][0m [32mexpo-system-ui[0m (6.0.8)
  - [33m[📦][0m [32mexpo-web-browser[0m (15.0.9)
Checking the license for package Android SDK Build-Tools 36 in /home/expo/Android/Sdk/licenses
License for package Android SDK Build-Tools 36 accepted.
Preparing "Install Android SDK Build-Tools 36 v.36.0.0".
"Install Android SDK Build-Tools 36 v.36.0.0" ready.
Installing Android SDK Build-Tools 36 in /home/expo/Android/Sdk/build-tools/36.0.0
"Install Android SDK Build-Tools 36 v.36.0.0" complete.
"Install Android SDK Build-Tools 36 v.36.0.0" finished.
[=========                              ] 25%                                   
[=========                              ] 25% Fetch remote repository...        
[=======================================] 100% Fetch remote repository...
> Task :expo-dev-client:preBuild UP-TO-DATE
> Task :expo-dev-launcher:preBuild UP-TO-DATE
> Task :expo-dev-menu:preBuild UP-TO-DATE
> Task :expo-dev-menu-interface:preBuild UP-TO-DATE
> Task :expo-manifests:preBuild UP-TO-DATE
> Task :expo-json-utils:preBuild UP-TO-DATE
> Task :expo-updates-interface:preBuild UP-TO-DATE
> Task :expo-modules-core:preBuild UP-TO-DATE
> Task :react-native-reanimated:assertMinimalReactNativeVersionTask
> Task :react-native-reanimated:assertNewArchitectureEnabledTask SKIPPED
> Task :react-native-reanimated:assertWorkletsVersionTask
> Task :react-native-gesture-handler:generateCodegenSchemaFromJavaScript
> Task :expo-constants:createExpoConfig
> Task :react-native-async-storage_async-storage:generateCodegenSchemaFromJavaScript
> Task :expo-constants:preBuild
> Task :react-native-safe-area-context:generateCodegenSchemaFromJavaScript
The NODE_ENV environment variable is required but was not specified. Ensure the project is bundled with Expo CLI or NODE_ENV is set. Using only .env.local and .env
> Task :react-native-screens:generateCodegenSchemaFromJavaScript
> Task :react-native-reanimated:generateCodegenSchemaFromJavaScript
> Task :react-native-gesture-handler:generateCodegenArtifactsFromSchema
> Task :react-native-gesture-handler:preBuild
> Task :react-native-async-storage_async-storage:generateCodegenArtifactsFromSchema
> Task :react-native-async-storage_async-storage:preBuild
> Task :react-native-svg:generateCodegenSchemaFromJavaScript
> Task :react-native-safe-area-context:generateCodegenArtifactsFromSchema
> Task :react-native-safe-area-context:preBuild
> Task :expo-constants:preDebugBuild
> Task :react-native-worklets:assertMinimalReactNativeVersionTask
> Task :react-native-worklets:assertNewArchitectureEnabledTask SKIPPED
> Task :react-native-reanimated:generateCodegenArtifactsFromSchema
> Task :react-native-screens:generateCodegenArtifactsFromSchema
> Task :react-native-screens:preBuild
> Task :expo-dev-client:preDebugBuild UP-TO-DATE
> Task :expo:generatePackagesList
> Task :expo:preBuild
> Task :expo:preDebugBuild
> Task :expo-constants:writeDebugAarMetadata
> Task :expo-dev-launcher:preDebugBuild UP-TO-DATE
> Task :react-native-reanimated:prepareReanimatedHeadersForPrefabs
> Task :react-native-reanimated:preBuild
> Task :expo-dev-menu:preDebugBuild UP-TO-DATE
> Task :expo-dev-launcher:writeDebugAarMetadata
> Task :expo-dev-menu-interface:preDebugBuild UP-TO-DATE
> Task :expo-dev-menu:writeDebugAarMetadata
> Task :react-native-webview:generateCodegenSchemaFromJavaScript
> Task :expo-json-utils:preDebugBuild UP-TO-DATE
> Task :expo-dev-client:writeDebugAarMetadata
> Task :expo-manifests:preDebugBuild UP-TO-DATE
> Task :expo:writeDebugAarMetadata
> Task :expo-modules-core:preDebugBuild UP-TO-DATE
> Task :expo-modules-core:writeDebugAarMetadata
> Task :expo-updates-interface:preDebugBuild UP-TO-DATE
> Task :expo-json-utils:writeDebugAarMetadata
> Task :react-native-async-storage_async-storage:preDebugBuild
> Task :expo-manifests:writeDebugAarMetadata
> Task :react-native-gesture-handler:preDebugBuild
> Task :react-native-worklets:generateCodegenSchemaFromJavaScript
> Task :react-native-svg:generateCodegenArtifactsFromSchema
> Task :react-native-svg:preBuild
> Task :react-native-reanimated:preDebugBuild
> Task :react-native-gesture-handler:writeDebugAarMetadata
> Task :react-native-safe-area-context:preDebugBuild
> Task :react-native-webview:generateCodegenArtifactsFromSchema
> Task :react-native-webview:preBuild
> Task :react-native-screens:preDebugBuild
> Task :react-native-async-storage_async-storage:writeDebugAarMetadata
> Task :react-native-svg:preDebugBuild
> Task :react-native-svg:writeDebugAarMetadata
> Task :react-native-worklets:generateCodegenArtifactsFromSchema
> Task :react-native-webview:preDebugBuild
> Task :react-native-reanimated:writeDebugAarMetadata
> Task :expo:generateDebugResValues
> Task :expo:generateDebugResources
> Task :react-native-worklets:prepareWorkletsHeadersForPrefabs
> Task :react-native-worklets:preBuild
> Task :react-native-worklets:preDebugBuild
> Task :react-native-screens:writeDebugAarMetadata
> Task :expo-constants:generateDebugResValues
> Task :expo-constants:generateDebugResources
> Task :expo-constants:packageDebugResources
> Task :expo:packageDebugResources
> Task :expo-updates-interface:writeDebugAarMetadata
> Task :expo-dev-client:generateDebugResValues
> Task :expo-dev-launcher:generateDebugResValues
> Task :expo-dev-menu:generateDebugResValues
> Task :react-native-worklets:writeDebugAarMetadata
> Task :expo-dev-client:generateDebugResources
> Task :expo-dev-menu-interface:generateDebugResValues
> Task :expo-dev-menu-interface:generateDebugResources
> Task :expo-dev-launcher:generateDebugResources
> Task :expo-dev-menu:generateDebugResources
> Task :expo-dev-menu-interface:packageDebugResources
> Task :expo-json-utils:generateDebugResValues
> Task :expo-dev-client:packageDebugResources
> Task :expo-json-utils:generateDebugResources
> Task :expo-manifests:generateDebugResValues
> Task :expo-manifests:generateDebugResources
> Task :expo-json-utils:packageDebugResources
> Task :expo-modules-core:generateDebugResValues
> Task :expo-modules-core:generateDebugResources
> Task :expo-manifests:packageDebugResources
> Task :expo-updates-interface:generateDebugResValues
> Task :expo-updates-interface:generateDebugResources
> Task :expo-modules-core:packageDebugResources
> Task :react-native-async-storage_async-storage:generateDebugResValues
> Task :react-native-async-storage_async-storage:generateDebugResources
> Task :expo-updates-interface:packageDebugResources
> Task :react-native-gesture-handler:generateDebugResValues
> Task :react-native-async-storage_async-storage:packageDebugResources
> Task :react-native-gesture-handler:generateDebugResources
> Task :react-native-reanimated:generateDebugResValues
> Task :react-native-reanimated:generateDebugResources
> Task :expo-dev-launcher:packageDebugResources
> Task :expo-dev-menu:packageDebugResources
> Task :react-native-gesture-handler:packageDebugResources
> Task :react-native-reanimated:packageDebugResources
> Task :react-native-safe-area-context:generateDebugResValues
> Task :react-native-svg:generateDebugResValues
> Task :react-native-screens:generateDebugResValues
> Task :react-native-webview:generateDebugResValues
> Task :react-native-svg:generateDebugResources
> Task :react-native-safe-area-context:generateDebugResources
> Task :react-native-webview:generateDebugResources
> Task :react-native-screens:generateDebugResources
> Task :react-native-safe-area-context:packageDebugResources
> Task :react-native-svg:packageDebugResources
> Task :react-native-webview:packageDebugResources
> Task :react-native-worklets:generateDebugResValues
> Task :expo:extractDeepLinksDebug
> Task :expo-constants:extractDeepLinksDebug
> Task :react-native-worklets:generateDebugResources
> Task :react-native-worklets:packageDebugResources
> Task :react-native-safe-area-context:writeDebugAarMetadata
> Task :react-native-screens:packageDebugResources
> Task :expo-dev-client:extractDeepLinksDebug
> Task :expo-dev-launcher:extractDeepLinksDebug
> Task :expo-dev-menu:extractDeepLinksDebug
> Task :expo:processDebugManifest
> Task :expo-constants:processDebugManifest
> Task :expo-dev-client:processDebugManifest
> Task :expo-manifests:extractDeepLinksDebug
> Task :expo-dev-menu-interface:extractDeepLinksDebug
> Task :expo-json-utils:extractDeepLinksDebug
> Task :expo-dev-menu:processDebugManifest
> Task :expo-manifests:processDebugManifest
> Task :expo-dev-menu-interface:writeDebugAarMetadata
> Task :expo-json-utils:processDebugManifest
> Task :expo-modules-core:extractDeepLinksDebug
> Task :expo-dev-menu-interface:processDebugManifest
> Task :expo-updates-interface:extractDeepLinksDebug
> Task :react-native-reanimated:extractDeepLinksDebug
> Task :react-native-gesture-handler:extractDeepLinksDebug
> Task :react-native-async-storage_async-storage:extractDeepLinksDebug
> Task :react-native-webview:writeDebugAarMetadata
> Task :react-native-safe-area-context:extractDeepLinksDebug
> Task :expo-modules-core:processDebugManifest
/home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/AndroidManifest.xml:8:9-11:45 Warning:
	meta-data#com.facebook.soloader.enabled@android:value was tagged at AndroidManifest.xml:8 to replace other declarations but no other declaration present
> Task :react-native-reanimated:processDebugManifest
> Task :react-native-screens:extractDeepLinksDebug
> Task :react-native-svg:extractDeepLinksDebug
> Task :expo-updates-interface:processDebugManifest
> Task :react-native-webview:extractDeepLinksDebug
> Task :react-native-gesture-handler:processDebugManifest
> Task :react-native-worklets:extractDeepLinksDebug
> Task :react-native-screens:processDebugManifest
> Task :react-native-svg:processDebugManifest
> Task :expo-dev-launcher:processDebugManifest
> Task :react-native-async-storage_async-storage:processDebugManifest
package="com.reactnativecommunity.asyncstorage" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/main/AndroidManifest.xml.
Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
Recommendation: remove package="com.reactnativecommunity.asyncstorage" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/main/AndroidManifest.xml.
> Task :react-native-safe-area-context:processDebugManifest
package="com.th3rdwave.safeareacontext" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/AndroidManifest.xml.
Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
Recommendation: remove package="com.th3rdwave.safeareacontext" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/AndroidManifest.xml.
> Task :react-native-webview:processDebugManifest
> Task :react-native-worklets:processDebugManifest
> Task :expo-constants:compileDebugLibraryResources
> Task :expo:compileDebugLibraryResources
> Task :expo-json-utils:compileDebugLibraryResources
> Task :expo-dev-menu-interface:compileDebugLibraryResources
> Task :expo-dev-client:compileDebugLibraryResources
> Task :expo-dev-launcher:parseDebugLocalResources
> Task :expo:parseDebugLocalResources
> Task :expo-dev-client:parseDebugLocalResources
> Task :expo:generateDebugRFile
> Task :expo-dev-client:generateDebugRFile
> Task :expo-dev-menu:parseDebugLocalResources
> Task :expo-dev-menu:generateDebugRFile
> Task :expo-dev-menu:compileDebugLibraryResources
> Task :expo-dev-menu-interface:parseDebugLocalResources
> Task :expo-dev-launcher:compileDebugLibraryResources
> Task :expo-manifests:compileDebugLibraryResources
> Task :expo-dev-menu-interface:generateDebugRFile
> Task :expo-constants:parseDebugLocalResources
> Task :expo-modules-core:compileDebugLibraryResources
> Task :expo-manifests:parseDebugLocalResources
> Task :expo-constants:generateDebugRFile
> Task :expo-json-utils:parseDebugLocalResources
> Task :expo-dev-launcher:generateDebugRFile
> Task :expo-updates-interface:parseDebugLocalResources
> Task :react-native-async-storage_async-storage:compileDebugLibraryResources
> Task :react-native-async-storage_async-storage:parseDebugLocalResources
> Task :expo-updates-interface:generateDebugRFile
> Task :expo-manifests:generateDebugRFile
> Task :expo-updates-interface:compileDebugLibraryResources
> Task :expo-modules-core:parseDebugLocalResources
> Task :react-native-gesture-handler:parseDebugLocalResources
> Task :react-native-gesture-handler:compileDebugLibraryResources
> Task :expo-json-utils:generateDebugRFile
> Task :react-native-reanimated:compileDebugLibraryResources
> Task :expo-modules-core:generateDebugRFile
> Task :react-native-async-storage_async-storage:generateDebugRFile
> Task :react-native-reanimated:parseDebugLocalResources
> Task :react-native-svg:compileDebugLibraryResources
> Task :react-native-gesture-handler:generateDebugRFile
> Task :react-native-safe-area-context:compileDebugLibraryResources
> Task :react-native-safe-area-context:parseDebugLocalResources
> Task :react-native-reanimated:generateDebugRFile
> Task :react-native-svg:parseDebugLocalResources
> Task :react-native-screens:parseDebugLocalResources
> Task :react-native-webview:compileDebugLibraryResources
> Task :react-native-screens:compileDebugLibraryResources
> Task :expo:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-safe-area-context:generateDebugRFile
> Task :react-native-worklets:compileDebugLibraryResources
> Task :expo-constants:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-webview:parseDebugLocalResources
> Task :react-native-svg:generateDebugRFile
> Task :expo-modules-core:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-screens:generateDebugRFile
> Task :expo-dev-client:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-constants:generateDebugBuildConfig
> Task :expo:generateDebugBuildConfig
> Task :expo-dev-launcher:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-modules-core:generateDebugBuildConfig
> Task :react-native-worklets:parseDebugLocalResources
> Task :react-native-webview:generateDebugRFile
> Task :expo-dev-menu:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-dev-menu:generateDebugBuildConfig
> Task :expo-dev-menu-interface:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-dev-menu-interface:generateDebugBuildConfig
> Task :expo-constants:javaPreCompileDebug
> Task :expo-json-utils:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-json-utils:generateDebugBuildConfig
> Task :expo-json-utils:javaPreCompileDebug
> Task :expo-manifests:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-manifests:generateDebugBuildConfig
> Task :expo-dev-menu-interface:javaPreCompileDebug
> Task :expo-manifests:javaPreCompileDebug
> Task :expo-updates-interface:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-updates-interface:generateDebugBuildConfig
> Task :react-native-worklets:generateDebugRFile
> Task :expo:javaPreCompileDebug
> Task :react-native-async-storage_async-storage:generateDebugBuildConfig
> Task :react-native-async-storage_async-storage:javaPreCompileDebug
> Task :expo-updates-interface:javaPreCompileDebug
> Task :react-native-gesture-handler:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-gesture-handler:generateDebugBuildConfig
> Task :react-native-reanimated:generateDebugBuildConfig
> Task :react-native-reanimated:javaPreCompileDebug
> Task :react-native-worklets:generateDebugBuildConfig
> Task :react-native-worklets:javaPreCompileDebug
> Task :expo-dev-client:dataBindingMergeDependencyArtifactsDebug
> Task :expo-dev-menu:javaPreCompileDebug
> Task :react-native-svg:generateDebugBuildConfig
> Task :expo-dev-client:dataBindingGenBaseClassesDebug
> Task :expo-dev-client:generateDebugBuildConfig
> Task :react-native-svg:javaPreCompileDebug
> Task :expo-dev-client:javaPreCompileDebug
> Task :react-native-gesture-handler:javaPreCompileDebug
> Task :react-native-safe-area-context:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-safe-area-context:generateDebugBuildConfig
> Task :react-native-screens:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-screens:generateDebugBuildConfig
> Task :react-native-worklets:compileDebugJavaWithJavac
Note: /home/expo/workingdir/build/node_modules/react-native-worklets/android/src/main/java/com/swmansion/worklets/WorkletsPackage.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
> Task :react-native-safe-area-context:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/java/com/th3rdwave/safeareacontext/SafeAreaView.kt:59:23 'val uiImplementation: UIImplementation!' is deprecated. Deprecated in Java.
> Task :react-native-async-storage_async-storage:compileDebugJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/javaPackage/java/com/reactnativecommunity/asyncstorage/AsyncStoragePackage.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
> Task :expo-modules-core:javaPreCompileDebug
> Task :react-native-svg:compileDebugJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: Some input files use unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
> Task :react-native-safe-area-context:javaPreCompileDebug
> Task :react-native-worklets:bundleLibCompileToJarDebug
> Task :react-native-async-storage_async-storage:bundleLibCompileToJarDebug
> Task :react-native-svg:bundleLibCompileToJarDebug
> Task :react-native-screens:javaPreCompileDebug
> Task :react-native-webview:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-webview:generateDebugBuildConfig
> Task :react-native-safe-area-context:compileDebugJavaWithJavac
> Task :react-native-safe-area-context:bundleLibCompileToJarDebug
> Task :expo:mergeDebugShaders
> Task :expo:compileDebugShaders NO-SOURCE
> Task :expo:generateDebugAssets UP-TO-DATE
> Task :expo:mergeDebugAssets
> Task :expo-constants:mergeDebugShaders
> Task :expo-constants:compileDebugShaders NO-SOURCE
> Task :expo-constants:generateDebugAssets UP-TO-DATE
> Task :expo-dev-client:mergeDebugShaders
> Task :expo-dev-client:compileDebugShaders NO-SOURCE
> Task :expo-dev-client:generateDebugAssets UP-TO-DATE
> Task :expo-dev-client:mergeDebugAssets
> Task :expo-constants:mergeDebugAssets
> Task :react-native-webview:javaPreCompileDebug
> Task :expo-dev-menu:mergeDebugShaders
> Task :expo-dev-menu:compileDebugShaders NO-SOURCE
> Task :expo-dev-menu:generateDebugAssets UP-TO-DATE
> Task :expo-dev-menu-interface:mergeDebugShaders
> Task :expo-dev-menu-interface:compileDebugShaders NO-SOURCE
> Task :expo-dev-menu-interface:generateDebugAssets UP-TO-DATE
> Task :expo-dev-menu:mergeDebugAssets
> Task :expo-dev-menu-interface:mergeDebugAssets
> Task :expo-json-utils:mergeDebugShaders
> Task :expo-manifests:mergeDebugShaders
> Task :expo-json-utils:compileDebugShaders NO-SOURCE
> Task :expo-json-utils:generateDebugAssets UP-TO-DATE
> Task :expo-manifests:compileDebugShaders NO-SOURCE
> Task :expo-manifests:generateDebugAssets UP-TO-DATE
> Task :expo-json-utils:mergeDebugAssets
> Task :expo-manifests:mergeDebugAssets
> Task :expo-modules-core:mergeDebugShaders
> Task :expo-updates-interface:mergeDebugShaders
> Task :expo-modules-core:compileDebugShaders NO-SOURCE
> Task :expo-modules-core:generateDebugAssets UP-TO-DATE
> Task :expo-updates-interface:compileDebugShaders NO-SOURCE
> Task :expo-updates-interface:generateDebugAssets UP-TO-DATE
> Task :expo-modules-core:mergeDebugAssets
> Task :expo-updates-interface:mergeDebugAssets
> Task :app:generateAutolinkingNewArchitectureFiles
> Task :react-native-async-storage_async-storage:mergeDebugShaders
> Task :react-native-gesture-handler:mergeDebugShaders
> Task :react-native-async-storage_async-storage:compileDebugShaders NO-SOURCE
> Task :react-native-async-storage_async-storage:generateDebugAssets UP-TO-DATE
> Task :react-native-gesture-handler:compileDebugShaders NO-SOURCE
> Task :react-native-gesture-handler:generateDebugAssets UP-TO-DATE
> Task :app:generateAutolinkingPackageList
> Task :react-native-gesture-handler:mergeDebugAssets
> Task :react-native-async-storage_async-storage:mergeDebugAssets
> Task :app:generateCodegenSchemaFromJavaScript SKIPPED
> Task :app:generateCodegenArtifactsFromSchema SKIPPED
> Task :react-native-safe-area-context:mergeDebugShaders
> Task :react-native-screens:mergeDebugShaders
> Task :react-native-screens:compileDebugShaders NO-SOURCE
> Task :react-native-screens:generateDebugAssets UP-TO-DATE
> Task :react-native-safe-area-context:compileDebugShaders NO-SOURCE
> Task :react-native-safe-area-context:generateDebugAssets UP-TO-DATE
> Task :app:generateReactNativeEntryPoint
> Task :app:preBuild
> Task :app:preDebugBuild
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:checkKotlinGradlePluginConfigurationErrors
SKIPPED
> Task :react-native-screens:mergeDebugAssets
> Task :react-native-safe-area-context:mergeDebugAssets
> Task :app:generateDebugBuildConfig
> Task :react-native-svg:mergeDebugShaders
> Task :react-native-svg:compileDebugShaders NO-SOURCE
> Task :react-native-svg:generateDebugAssets UP-TO-DATE
> Task :react-native-webview:mergeDebugShaders
> Task :react-native-webview:compileDebugShaders NO-SOURCE
> Task :react-native-webview:generateDebugAssets UP-TO-DATE
> Task :react-native-svg:mergeDebugAssets
> Task :react-native-webview:mergeDebugAssets
> Task :react-native-reanimated:compileDebugJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: Some input files use unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
> Task :react-native-svg:bundleLibRuntimeToJarDebug
> Task :react-native-webview:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:22:8 'object MapBuilder : Any' is deprecated. Use Kotlin's built-in collections extensions.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:82:18 'var allowFileAccessFromFileURLs: Boolean' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:83:18 'var allowUniversalAccessFromFileURLs: Boolean' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:125:21 'fun allowScanningByMediaScanner(): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:162:36 'var systemUiVisibility: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:301:14 'object MapBuilder : Any' is deprecated. Use Kotlin's built-in collections extensions.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:351:34 Condition is always 'true'.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:370:38 'var allowUniversalAccessFromFileURLs: Boolean' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:431:51 Unchecked cast of 'Any?' to 'HashMap<String, String>'.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:487:23 'var savePassword: Boolean' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:488:23 'var saveFormData: Boolean' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:558:23 'var allowFileAccessFromFileURLs: Boolean' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:659:65 Unchecked cast of 'ArrayList<Any?>' to 'List<Map<String, String>>'.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManagerImpl.kt:680:23 'var saveFormData: Boolean' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopCustomMenuSelectionEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopCustomMenuSelectionEvent.kt:11:3 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopCustomMenuSelectionEvent.kt:22:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopCustomMenuSelectionEvent.kt:22:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopCustomMenuSelectionEvent.kt:23:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopHttpErrorEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopHttpErrorEvent.kt:11:3 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopHttpErrorEvent.kt:22:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopHttpErrorEvent.kt:22:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopHttpErrorEvent.kt:23:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingErrorEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingErrorEvent.kt:11:3 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingErrorEvent.kt:22:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingErrorEvent.kt:22:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingErrorEvent.kt:23:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingFinishEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingFinishEvent.kt:11:3 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingFinishEvent.kt:22:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingFinishEvent.kt:22:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingFinishEvent.kt:23:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingProgressEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingProgressEvent.kt:11:3 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingProgressEvent.kt:22:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingProgressEvent.kt:22:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingProgressEvent.kt:23:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingStartEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingStartEvent.kt:11:3 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingStartEvent.kt:22:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingStartEvent.kt:22:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopLoadingStartEvent.kt:23:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopMessageEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopMessageEvent.kt:10:75 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopMessageEvent.kt:21:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopMessageEvent.kt:21:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopMessageEvent.kt:22:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopNewWindowEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopNewWindowEvent.kt:11:3 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopNewWindowEvent.kt:22:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopNewWindowEvent.kt:22:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopNewWindowEvent.kt:23:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopRenderProcessGoneEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopRenderProcessGoneEvent.kt:12:3 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopRenderProcessGoneEvent.kt:23:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopRenderProcessGoneEvent.kt:23:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopRenderProcessGoneEvent.kt:24:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopShouldStartLoadWithRequestEvent.kt:5:8 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopShouldStartLoadWithRequestEvent.kt:10:89 'constructor<T : Event<T>>(viewTag: Int): Event<T>' is deprecated. Use constructor with explicit surfaceId instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopShouldStartLoadWithRequestEvent.kt:27:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopShouldStartLoadWithRequestEvent.kt:27:42 'interface RCTEventEmitter : JavaScriptModule' is deprecated. Use [RCTModernEventEmitter] instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/events/TopShouldStartLoadWithRequestEvent.kt:28:21 'fun receiveEvent(targetTag: Int, eventName: String, params: WritableMap?): Unit' is deprecated. Use [RCTModernEventEmitter.receiveEvent] instead.
> Task :react-native-worklets:mergeDebugShaders
> Task :react-native-reanimated:mergeDebugShaders
> Task :react-native-reanimated:compileDebugShaders NO-SOURCE
> Task :react-native-reanimated:generateDebugAssets UP-TO-DATE
> Task :react-native-safe-area-context:bundleLibRuntimeToJarDebug
> Task :react-native-worklets:compileDebugShaders NO-SOURCE
> Task :react-native-worklets:generateDebugAssets UP-TO-DATE
> Task :react-native-reanimated:bundleLibCompileToJarDebug
> Task :react-native-reanimated:mergeDebugAssets
> Task :react-native-worklets:mergeDebugAssets
> Task :react-native-reanimated:bundleLibRuntimeToJarDebug
> Task :expo-dev-launcher:dataBindingMergeDependencyArtifactsDebug
> Task :react-native-worklets:bundleLibRuntimeToJarDebug
> Task :react-native-async-storage_async-storage:bundleLibRuntimeToJarDebug
> Task :react-native-webview:compileDebugJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
> Task :react-native-webview:bundleLibCompileToJarDebug
> Task :react-native-webview:bundleLibRuntimeToJarDebug
> Task :expo-dev-launcher:dataBindingGenBaseClassesDebug
> Task :expo-dev-launcher:generateDebugBuildConfig
> Task :expo-dev-launcher:checkApolloVersions
> Task :expo-dev-launcher:generateServiceApolloOptions
> Task :expo-dev-launcher:generateServiceApolloSources
w: /home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/graphql/GetBranches.graphql: (21, 11): Apollo: Use of deprecated field `runtimeVersion`
w: /home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/graphql/GetBranches.graphql: (34, 3): Apollo: Variable `platform` is unused
w: /home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/graphql/GetUpdates.graphql: (14, 11): Apollo: Use of deprecated field `runtimeVersion`
> Task :expo-dev-launcher:javaPreCompileDebug
> Task :expo-dev-launcher:mergeDebugShaders
> Task :expo-dev-launcher:compileDebugShaders NO-SOURCE
> Task :expo-dev-launcher:generateDebugAssets UP-TO-DATE
> Task :expo-dev-launcher:mergeDebugAssets
> Task :react-native-async-storage_async-storage:processDebugJavaRes NO-SOURCE
> Task :react-native-reanimated:processDebugJavaRes NO-SOURCE
> Task :react-native-safe-area-context:processDebugJavaRes
> Task :react-native-svg:processDebugJavaRes NO-SOURCE
> Task :react-native-webview:processDebugJavaRes
> Task :react-native-worklets:processDebugJavaRes NO-SOURCE
> Task :expo:mergeDebugJniLibFolders
> Task :expo:mergeDebugNativeLibs NO-SOURCE
> Task :expo:copyDebugJniLibsProjectOnly
> Task :expo-constants:mergeDebugJniLibFolders
> Task :expo-constants:mergeDebugNativeLibs NO-SOURCE
> Task :expo-constants:copyDebugJniLibsProjectOnly
> Task :expo-dev-client:mergeDebugJniLibFolders
> Task :expo-dev-client:mergeDebugNativeLibs NO-SOURCE
> Task :expo-dev-client:copyDebugJniLibsProjectOnly
> Task :expo-dev-launcher:mergeDebugJniLibFolders
> Task :expo-dev-launcher:mergeDebugNativeLibs NO-SOURCE
> Task :expo-dev-launcher:copyDebugJniLibsProjectOnly
> Task :expo-dev-menu:mergeDebugJniLibFolders
> Task :expo-dev-menu:mergeDebugNativeLibs NO-SOURCE
> Task :expo-dev-menu:copyDebugJniLibsProjectOnly
> Task :expo-dev-menu-interface:mergeDebugJniLibFolders
> Task :expo-dev-menu-interface:mergeDebugNativeLibs NO-SOURCE
> Task :expo-dev-menu-interface:copyDebugJniLibsProjectOnly
> Task :expo-json-utils:mergeDebugJniLibFolders
> Task :expo-json-utils:mergeDebugNativeLibs NO-SOURCE
> Task :expo-json-utils:copyDebugJniLibsProjectOnly
> Task :expo-manifests:mergeDebugJniLibFolders
> Task :expo-manifests:mergeDebugNativeLibs NO-SOURCE
> Task :expo-manifests:copyDebugJniLibsProjectOnly
> Task :expo-updates-interface:mergeDebugJniLibFolders
> Task :expo-updates-interface:mergeDebugNativeLibs NO-SOURCE
> Task :expo-updates-interface:copyDebugJniLibsProjectOnly
> Task :react-native-async-storage_async-storage:mergeDebugJniLibFolders
> Task :react-native-async-storage_async-storage:mergeDebugNativeLibs NO-SOURCE
> Task :react-native-async-storage_async-storage:copyDebugJniLibsProjectOnly
> Task :react-native-gesture-handler:mergeDebugJniLibFolders
> Task :react-native-reanimated:mergeDebugJniLibFolders
> Task :react-native-safe-area-context:mergeDebugJniLibFolders
> Task :react-native-safe-area-context:mergeDebugNativeLibs NO-SOURCE
> Task :react-native-safe-area-context:copyDebugJniLibsProjectOnly
> Task :react-native-worklets:configureCMakeDebug[arm64-v8a]
Checking the license for package CMake 3.22.1 in /home/expo/Android/Sdk/licenses
License for package CMake 3.22.1 accepted.
Preparing "Install CMake 3.22.1 v.3.22.1".
"Install CMake 3.22.1 v.3.22.1" ready.
Installing CMake 3.22.1 in /home/expo/Android/Sdk/cmake/3.22.1
"Install CMake 3.22.1 v.3.22.1" complete.
"Install CMake 3.22.1 v.3.22.1" finished.
> Task :app:checkDebugAarMetadata
> Task :app:generateDebugResValues
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources
> Task :react-native-screens:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/RNScreensPackage.kt:56:9 The corresponding parameter in the supertype 'BaseReactPackage' is named 'name'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/RNScreensPackage.kt:57:9 The corresponding parameter in the supertype 'BaseReactPackage' is named 'reactContext'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/RNScreensPackage.kt:70:17 'constructor(name: String, className: String, canOverrideExistingModule: Boolean, needsEagerInit: Boolean, hasConstants: Boolean, isCxxModule: Boolean, isTurboModule: Boolean): ReactModuleInfo' is deprecated. This constructor is deprecated and will be removed in the future. Use ReactModuleInfo(String, String, boolean, boolean, boolean, boolean)].
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/Screen.kt:48:77 Unchecked cast of '(CoordinatorLayout.Behavior<View!>?..CoordinatorLayout.Behavior<*>?)' to 'BottomSheetBehavior<Screen>'.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/Screen.kt:383:36 'fun setTranslucent(screen: Screen, activity: Activity?, context: ReactContext?): Unit' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/Screen.kt:402:36 'fun setColor(screen: Screen, activity: Activity?, context: ReactContext?): Unit' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/Screen.kt:420:36 'fun setNavigationBarColor(screen: Screen, activity: Activity?): Unit' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/Screen.kt:437:36 'fun setNavigationBarTranslucent(screen: Screen, activity: Activity?): Unit' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:217:31 'var targetElevation: Float' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:220:13 'fun setHasOptionsMenu(p0: Boolean): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:397:18 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:404:22 'fun onPrepareOptionsMenu(p0: Menu): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:407:18 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:412:22 'fun onCreateOptionsMenu(p0: Menu, p1: MenuInflater): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfig.kt:435:18 'val reactNativeHost: ReactNativeHost' is deprecated. You should not use ReactNativeHost directly in the New Architecture. Use ReactHost instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:203:14 'var statusBarColor: Int?' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:220:14 'var isStatusBarTranslucent: Boolean?' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:237:14 'var navigationBarColor: Int?' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:246:14 'var isNavigationBarTranslucent: Boolean?' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:55:42 'fun replaceSystemWindowInsets(p0: Int, p1: Int, p2: Int, p3: Int): WindowInsetsCompat' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:56:39 'val systemWindowInsetLeft: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:58:39 'val systemWindowInsetRight: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:59:39 'val systemWindowInsetBottom: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:102:53 'var statusBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:106:37 'var statusBarColor: Int?' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:113:48 'var statusBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:116:32 'var statusBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:162:49 'var isStatusBarTranslucent: Boolean?' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:218:43 'var navigationBarColor: Int?' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:218:72 'var navigationBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:224:16 'var navigationBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:241:55 'var isNavigationBarTranslucent: Boolean?' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:283:13 'fun setColor(screen: Screen, activity: Activity?, context: ReactContext?): Unit' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:285:13 'fun setTranslucent(screen: Screen, activity: Activity?, context: ReactContext?): Unit' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:289:13 'fun setNavigationBarColor(screen: Screen, activity: Activity?): Unit' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:290:13 'fun setNavigationBarTranslucent(screen: Screen, activity: Activity?): Unit' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:354:42 'var statusBarColor: Int?' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:356:48 'var isStatusBarTranslucent: Boolean?' is deprecated. For apps targeting SDK 35 or above this prop has no effect because edge-to-edge is enabled by default and the status bar is always translucent.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:359:57 'var navigationBarColor: Int?' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:360:63 'var isNavigationBarTranslucent: Boolean?' is deprecated. For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:7:8 'object ReactFeatureFlags : Any' is deprecated. Use com.facebook.react.internal.featureflags.ReactNativeFeatureFlags instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:25:13 'object ReactFeatureFlags : Any' is deprecated. Use com.facebook.react.internal.featureflags.ReactNativeFeatureFlags instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:32:9 The corresponding parameter in the supertype 'ReactViewGroup' is named 'left'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:33:9 The corresponding parameter in the supertype 'ReactViewGroup' is named 'top'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:34:9 The corresponding parameter in the supertype 'ReactViewGroup' is named 'right'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:35:9 The corresponding parameter in the supertype 'ReactViewGroup' is named 'bottom'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:71:9 The corresponding parameter in the supertype 'RootView' is named 'childView'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:72:9 The corresponding parameter in the supertype 'RootView' is named 'ev'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:79:46 The corresponding parameter in the supertype 'RootView' is named 'ev'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:83:9 The corresponding parameter in the supertype 'RootView' is named 'childView'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:84:9 The corresponding parameter in the supertype 'RootView' is named 'ev'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:95:34 The corresponding parameter in the supertype 'RootView' is named 't'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/DimmingView.kt:63:9 The corresponding parameter in the supertype 'ReactCompoundView' is named 'touchX'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/DimmingView.kt:64:9 The corresponding parameter in the supertype 'ReactCompoundView' is named 'touchY'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/DimmingView.kt:68:9 The corresponding parameter in the supertype 'ReactCompoundViewGroup' is named 'touchX'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/DimmingView.kt:69:9 The corresponding parameter in the supertype 'ReactCompoundViewGroup' is named 'touchY'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/gamma/tabs/TabsHostViewManager.kt:37:9 The corresponding parameter in the supertype 'TabsHostViewManager' is named 'view'. This may cause problems when calling this function with named arguments.
> Task :react-native-svg:mergeDebugJniLibFolders
> Task :react-native-svg:mergeDebugNativeLibs
NO-SOURCE
> Task :react-native-svg:copyDebugJniLibsProjectOnly
> Task :react-native-webview:mergeDebugJniLibFolders
> Task :react-native-webview:mergeDebugNativeLibs NO-SOURCE
> Task :react-native-webview:copyDebugJniLibsProjectOnly
> Task :react-native-screens:configureCMakeDebug[arm64-v8a]
> Task :expo-modules-core:configureCMakeDebug[arm64-v8a]
> Task :app:packageDebugResources
> Task :react-native-worklets:configureCMakeDebug[armeabi-v7a]
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug
> Task :app:parseDebugLocalResources
> Task :react-native-screens:compileDebugJavaWithJavac
> Task :react-native-screens:bundleLibRuntimeToJarDebug
> Task :react-native-screens:bundleLibCompileToJarDebug
> Task :react-native-screens:processDebugJavaRes
> Task :react-native-gesture-handler:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/react/RNGestureHandlerRootView.kt:41:43 The corresponding parameter in the supertype 'ReactViewGroup' is named 'ev'. This may cause problems when calling this function with named arguments.
> Task :app:mergeDebugResources
> Task :app:processDebugMainManifest
/home/expo/workingdir/build/android/app/src/debug/AndroidManifest.xml:6:5-162 Warning:
	application@android:usesCleartextTraffic was tagged at AndroidManifest.xml:6 to replace other declarations but no other declaration present
/home/expo/workingdir/build/android/app/src/debug/AndroidManifest.xml Warning:
	provider#expo.modules.filesystem.FileSystemFileProvider@android:authorities was tagged at AndroidManifest.xml:0 to replace other declarations but no other declaration present
> Task :app:processDebugManifest
> Task :app:javaPreCompileDebug
> Task :app:mergeDebugShaders
> Task :react-native-worklets:configureCMakeDebug[x86]
> Task :app:processDebugManifestForPackage
> Task :react-native-worklets:configureCMakeDebug[x86_64]
> Task :react-native-worklets:generateJsonModelDebug
> Task :react-native-worklets:prefabDebugConfigurePackage
> Task :react-native-gesture-handler:compileDebugJavaWithJavac
> Task :expo-modules-core:compileDebugKotlin
> Task :react-native-gesture-handler:bundleLibCompileToJarDebug
> Task :react-native-gesture-handler:bundleLibRuntimeToJarDebug
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets
> Task :app:compressDebugAssets
> Task :app:desugarDebugFileDependencies
> Task :react-native-gesture-handler:processDebugJavaRes
> Task :app:mergeDebugJniLibFolders
> Task :app:validateSigningDebug
> Task :app:writeDebugAppMetadata
> Task :app:writeDebugSigningConfigVersions
> Task :app:checkDebugDuplicateClasses
> Task :app:processDebugResources
> Task :expo-modules-core:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/adapters/react/apploader/RNHeadlessAppLoader.kt:48:87 'val reactNativeHost: ReactNativeHost' is deprecated. You should not use ReactNativeHost directly in the New Architecture. Use ReactHost instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/adapters/react/apploader/RNHeadlessAppLoader.kt:91:85 'val reactNativeHost: ReactNativeHost' is deprecated. You should not use ReactNativeHost directly in the New Architecture. Use ReactHost instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/adapters/react/apploader/RNHeadlessAppLoader.kt:120:83 'val reactNativeHost: ReactNativeHost' is deprecated. You should not use ReactNativeHost directly in the New Architecture. Use ReactHost instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/apploader/AppLoaderProvider.kt:34:52 Unchecked cast of 'Class<*>!' to 'Class<out HeadlessAppLoader>'.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/AppContext.kt:30:8 'typealias ErrorManagerModule = JSLoggerModule' is deprecated. Use JSLoggerModule instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/AppContext.kt:253:21 'typealias ErrorManagerModule = JSLoggerModule' is deprecated. Use JSLoggerModule instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/AppContext.kt:343:21 'val DEFAULT: Int' is deprecated. UIManagerType.DEFAULT will be deleted in the next release of React Native. Use [LEGACY] instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/defaultmodules/NativeModulesProxyModule.kt:16:5 'fun Constants(legacyConstantsProvider: () -> Map<String, Any?>): Unit' is deprecated. Use `Constant` or `Property` instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/jni/PromiseImpl.kt:65:51 'val errorManager: JSLoggerModule?' is deprecated. Use AppContext.jsLogger instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/jni/PromiseImpl.kt:69:22 'fun reportExceptionToLogBox(codedException: CodedException): Unit' is deprecated. Use appContext.jsLogger.error(...) instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/views/ViewDefinitionBuilder.kt:464:16 'val errorManager: JSLoggerModule?' is deprecated. Use AppContext.jsLogger instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/views/ViewDefinitionBuilder.kt:464:30 'fun reportExceptionToLogBox(codedException: CodedException): Unit' is deprecated. Use appContext.jsLogger.error(...) instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/views/ViewManagerDefinition.kt:41:16 'val errorManager: JSLoggerModule?' is deprecated. Use AppContext.jsLogger instead.
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/views/ViewManagerDefinition.kt:41:30 'fun reportExceptionToLogBox(codedException: CodedException): Unit' is deprecated. Use appContext.jsLogger.error(...) instead.
> Task :react-native-screens:buildCMakeDebug[arm64-v8a]
> Task :react-native-screens:configureCMakeDebug[armeabi-v7a]
> Task :expo-modules-core:buildCMakeDebug[arm64-v8a]
> Task :react-native-worklets:buildCMakeDebug[arm64-v8a][worklets]
> Task :react-native-reanimated:configureCMakeDebug[arm64-v8a]
> Task :react-native-screens:buildCMakeDebug[armeabi-v7a]
> Task :expo-modules-core:configureCMakeDebug[armeabi-v7a]
> Task :react-native-screens:configureCMakeDebug[x86]
> Task :app:mergeExtDexDebug
> Task :react-native-screens:buildCMakeDebug[x86]
> Task :react-native-screens:configureCMakeDebug[x86_64]
> Task :expo-modules-core:buildCMakeDebug[armeabi-v7a]
> Task :react-native-screens:buildCMakeDebug[x86_64]
> Task :react-native-screens:mergeDebugJniLibFolders
> Task :react-native-screens:mergeDebugNativeLibs
> Task :react-native-screens:copyDebugJniLibsProjectOnly
> Task :expo-modules-core:configureCMakeDebug[x86]
> Task :react-native-worklets:buildCMakeDebug[armeabi-v7a][worklets]
> Task :expo-modules-core:compileDebugJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
> Task :expo-modules-core:bundleLibCompileToJarDebug
> Task :expo-dev-client:compileDebugKotlin NO-SOURCE
> Task :expo-json-utils:compileDebugKotlin
> Task :expo-modules-core:bundleLibRuntimeToJarDebug
> Task :expo-json-utils:compileDebugJavaWithJavac
> Task :expo-json-utils:bundleLibCompileToJarDebug
> Task :expo-dev-client:compileDebugJavaWithJavac
> Task :expo-dev-client:bundleLibCompileToJarDebug
> Task :expo-constants:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-constants/android/src/main/java/expo/modules/constants/ConstantsModule.kt:12:5 'fun Constants(legacyConstantsProvider: () -> Map<String, Any?>): Unit' is deprecated. Use `Constant` or `Property` instead.
> Task :expo-updates-interface:compileDebugKotlin
> Task :expo-dev-client:bundleLibRuntimeToJarDebug
> Task :expo-constants:compileDebugJavaWithJavac
> Task :expo-json-utils:bundleLibRuntimeToJarDebug
> Task :expo-constants:bundleLibCompileToJarDebug
> Task :expo-dev-menu-interface:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu-interface/android/src/main/java/expo/interfaces/devmenu/DevMenuInterfacePackage.kt:14:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu-interface/android/src/main/java/expo/interfaces/devmenu/ReactHostWrapper.kt:5:8 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu-interface/android/src/main/java/expo/interfaces/devmenu/ReactHostWrapper.kt:19:41 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu-interface/android/src/main/java/expo/interfaces/devmenu/ReactHostWrapper.kt:20:33 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
> Task :expo-constants:bundleLibRuntimeToJarDebug
> Task :expo-dev-menu-interface:compileDebugJavaWithJavac
> Task :expo-dev-menu-interface:bundleLibCompileToJarDebug
> Task :expo-constants:processDebugJavaRes
> Task :expo-dev-client:processDebugJavaRes NO-SOURCE
> Task :expo-dev-menu-interface:processDebugJavaRes
> Task :expo-json-utils:processDebugJavaRes
> Task :expo-updates-interface:compileDebugJavaWithJavac
> Task :expo-dev-menu-interface:bundleLibRuntimeToJarDebug
> Task :expo-updates-interface:bundleLibCompileToJarDebug
> Task :expo-modules-core:processDebugJavaRes
> Task :expo-updates-interface:processDebugJavaRes
> Task :expo-updates-interface:bundleLibRuntimeToJarDebug
> Task :expo-manifests:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/EmbeddedManifest.kt:19:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/EmbeddedManifest.kt:19:86 'fun getLegacyID(): String' is deprecated. Prefer scopeKey or projectId depending on use case.
w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/ExpoUpdatesManifest.kt:16:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/Manifest.kt:13:3 Deprecations and opt-ins on a method overridden from 'Any' may not be reported.
w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/Manifest.kt:15:12 'fun getRawJson(): JSONObject' is deprecated. Prefer to use specific field getters.
> Task :expo-manifests:compileDebugJavaWithJavac
> Task :expo-manifests:bundleLibCompileToJarDebug
> Task :expo-manifests:processDebugJavaRes
> Task :expo-manifests:bundleLibRuntimeToJarDebug
> Task :react-native-worklets:buildCMakeDebug[x86][worklets]
> Task :expo-dev-menu:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/debug/java/expo/modules/devmenu/DevMenuManager.kt:406:43 The corresponding parameter in the supertype 'DevMenuManagerInterface' is named 'shouldAutoLaunch'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:6:8 'class PreferenceManager : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:18:51 'class PreferenceManager : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:18:69 'static fun getDefaultSharedPreferences(p0: Context!): SharedPreferences!' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:51:13 This code uses error suppression for 'NOTHING_TO_OVERRIDE'. While it might compile and work, the compiler behavior is UNSPECIFIED and WILL NOT BE PRESERVED. Please report your use case to the Kotlin issue tracker instead: https://kotl.in/issue
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:58:13 This code uses error suppression for 'NOTHING_TO_OVERRIDE'. While it might compile and work, the compiler behavior is UNSPECIFIED and WILL NOT BE PRESERVED. Please report your use case to the Kotlin issue tracker instead: https://kotl.in/issue
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/expo/modules/devmenu/DevMenuPackage.kt:28:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/expo/modules/devmenu/DevMenuPackage.kt:47:78 'val reactNativeHost: ReactNativeHost' is deprecated. You should not use ReactNativeHost directly in the New Architecture. Use ReactHost instead.
> Task :expo-modules-core:buildCMakeDebug[x86]
> Task :expo-dev-menu:compileDebugJavaWithJavac
> Task :expo-dev-menu:bundleLibRuntimeToJarDebug
> Task :expo-dev-menu:bundleLibCompileToJarDebug
> Task :expo-dev-menu:processDebugJavaRes
> Task :expo-modules-core:configureCMakeDebug[x86_64]
> Task :react-native-worklets:buildCMakeDebug[x86_64][worklets]
> Task :react-native-worklets:externalNativeBuildDebug
> Task :react-native-worklets:prefabDebugPackage
> Task :react-native-worklets:mergeDebugJniLibFolders
> Task :react-native-worklets:mergeDebugNativeLibs
> Task :react-native-worklets:copyDebugJniLibsProjectOnly
> Task :react-native-reanimated:configureCMakeDebug[armeabi-v7a]
> Task :react-native-reanimated:configureCMakeDebug[x86]
> Task :react-native-reanimated:configureCMakeDebug[x86_64]
> Task :react-native-reanimated:generateJsonModelDebug
> Task :react-native-reanimated:prefabDebugConfigurePackage
> Task :expo-dev-launcher:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/DevLauncherController.kt:474:81 'val reactNativeHost: ReactNativeHost' is deprecated. You should not use ReactNativeHost directly in the New Architecture. Use ReactHost instead.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/compose/models/BranchViewModel.kt:80:31 'val runtimeVersion: String' is deprecated. Use 'runtime' field .
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/helpers/DevLauncherReactUtils.kt:7:8 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/helpers/DevLauncherReactUtils.kt:78:20 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/helpers/DevLauncherReactUtils.kt:155:20 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/helpers/DevLauncherReactUtils.kt:246:11 'fun newInstance(): CapturedType(*)!' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/launcher/DevLauncherActivity.kt:19:5 'fun overridePendingTransition(p0: Int, p1: Int): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/launcher/DevLauncherActivity.kt:36:5 'fun overridePendingTransition(p0: Int, p1: Int): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/modules/DevLauncherModule.kt:16:29 'fun getRawJson(): JSONObject' is deprecated. Prefer to use specific field getters.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/react/DevLauncherBridgeDevSupportManager.kt:49:38 This code uses error suppression for 'NOTHING_TO_OVERRIDE'. While it might compile and work, the compiler behavior is UNSPECIFIED and WILL NOT BE PRESERVED. Please report your use case to the Kotlin issue tracker instead: https://kotl.in/issue
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/react/DevLauncherBridgelessDevSupportManager.kt:48:38 This code uses error suppression for 'NOTHING_TO_OVERRIDE'. While it might compile and work, the compiler behavior is UNSPECIFIED and WILL NOT BE PRESERVED. Please report your use case to the Kotlin issue tracker instead: https://kotl.in/issue
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/react/DevLauncherDevSupportManagerFactory.kt:19:5 The corresponding parameter in the supertype 'DevSupportManagerFactory' is named 'reactInstanceManagerHelper'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/react/DevLauncherDevSupportManagerFactory.kt:48:5 The corresponding parameter in the supertype 'DevSupportManagerFactory' is named 'reactInstanceManagerHelper'. This may cause problems when calling this function with named arguments.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/react/DevLauncherDevSupportManagerSwapper.kt:6:8 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/debug/java/expo/modules/devlauncher/react/DevLauncherDevSupportManagerSwapper.kt:34:58 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/DevLauncherPackage.kt:15:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/DevLauncherRecentlyOpenedAppsRegistry.kt:33:47 Unchecked cast of 'MutableMap<Any?, Any?>' to 'MutableMap<String, Any>'.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/DevLauncherRecentlyOpenedAppsRegistry.kt:51:27 'fun getRawJson(): JSONObject' is deprecated. Prefer to use specific field getters.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:37:23 'constructor(p0: String!, p1: Bitmap!, p2: Int): ActivityManager.TaskDescription' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:63:61 'static field FLAG_TRANSLUCENT_STATUS: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:92:45 'var systemUiVisibility: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:95:68 'static field SYSTEM_UI_FLAG_LIGHT_STATUS_BAR: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:99:67 'static field SYSTEM_UI_FLAG_LIGHT_STATUS_BAR: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:103:67 'static field SYSTEM_UI_FLAG_LIGHT_STATUS_BAR: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:107:15 'var systemUiVisibility: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:115:59 'static field FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:116:61 'static field FLAG_FORCE_NOT_FULLSCREEN: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:118:59 'static field FLAG_FORCE_NOT_FULLSCREEN: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:119:61 'static field FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:131:23 'fun replaceSystemWindowInsets(p0: Int, p1: Int, p2: Int, p3: Int): WindowInsets' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:132:25 'val systemWindowInsetLeft: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:134:25 'val systemWindowInsetRight: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:135:25 'val systemWindowInsetBottom: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:150:15 'var statusBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:160:63 'static field FLAG_TRANSLUCENT_NAVIGATION: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:161:25 'var navigationBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:171:63 'static field FLAG_TRANSLUCENT_NAVIGATION: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:175:33 'var systemUiVisibility: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:176:33 'static field SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:177:21 'var systemUiVisibility: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:190:29 'var systemUiVisibility: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:191:62 'static field SYSTEM_UI_FLAG_HIDE_NAVIGATION: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:191:101 'static field SYSTEM_UI_FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:192:63 'static field SYSTEM_UI_FLAG_HIDE_NAVIGATION: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:192:102 'static field SYSTEM_UI_FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:192:136 'static field SYSTEM_UI_FLAG_IMMERSIVE: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:193:70 'static field SYSTEM_UI_FLAG_HIDE_NAVIGATION: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:193:109 'static field SYSTEM_UI_FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:193:143 'static field SYSTEM_UI_FLAG_IMMERSIVE_STICKY: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:196:17 'var systemUiVisibility: Int' is deprecated. Deprecated in Java.
> Task :expo-modules-core:buildCMakeDebug[x86_64]
> Task :expo-modules-core:mergeDebugJniLibFolders
> Task :expo-modules-core:mergeDebugNativeLibs
> Task :expo-modules-core:copyDebugJniLibsProjectOnly
> Task :expo-dev-launcher:compileDebugJavaWithJavac
> Task :expo-dev-launcher:processDebugJavaRes
> Task :expo-dev-launcher:bundleLibCompileToJarDebug
> Task :expo-dev-launcher:bundleLibRuntimeToJarDebug
> Task :expo:compileDebugKotlin
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ExpoModulesPackage.kt:34:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ExpoReactHostFactory.kt:8:8 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ExpoReactHostFactory.kt:80:22 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:24:8 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:58:33 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:105:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:105:38 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:113:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:114:21 'val reactInstanceManager: ReactInstanceManager' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:168:36 'constructor(activity: Activity, reactNativeHost: ReactNativeHost?, appKey: String?, launchOptions: Bundle?, fabricEnabled: Boolean): ReactDelegate' is deprecated. Deprecated since 0.81.0, use one of the other constructors instead.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:279:77 'val reactInstanceManager: ReactInstanceManager' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:282:22 'val reactInstanceManager: ReactInstanceManager' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:286:54 'val reactInstanceManager: ReactInstanceManager' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactNativeHostWrapper.kt:6:8 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactNativeHostWrapper.kt:15:9 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactNativeHostWrapper.kt:47:60 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactNativeHostWrapperBase.kt:7:8 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactNativeHostWrapperBase.kt:16:23 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactNativeHostWrapperBase.kt:89:16 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactNativeHostWrapperBase.kt:101:38 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/fetch/ExpoFetchModule.kt:30:39 'constructor(reactContext: ReactContext): ForwardingCookieHandler' is deprecated. Use the default constructor.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/fetch/NativeResponse.kt:42:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/fetch/NativeResponse.kt:44:11 'fun deallocate(): Unit' is deprecated. Use sharedObjectDidRelease() instead.
> Task :expo:compileDebugJavaWithJavac
> Task :expo:bundleLibCompileToJarDebug
> Task :expo:bundleLibRuntimeToJarDebug
> Task :expo:processDebugJavaRes
> Task :app:configureCMakeDebug[arm64-v8a]
> Task :react-native-reanimated:buildCMakeDebug[arm64-v8a][reanimated]
> Task :react-native-gesture-handler:configureCMakeDebug[arm64-v8a]
> Task :react-native-reanimated:buildCMakeDebug[armeabi-v7a][reanimated]
> Task :react-native-reanimated:buildCMakeDebug[x86][reanimated]
> Task :react-native-reanimated:buildCMakeDebug[x86_64][reanimated]
> Task :react-native-reanimated:externalNativeBuildDebug
> Task :react-native-reanimated:prefabDebugPackage
> Task :react-native-reanimated:mergeDebugNativeLibs
> Task :app:mergeLibDexDebug
> Task :app:compileDebugKotlin
w: file:///home/expo/workingdir/build/android/app/src/main/java/com/alessandro/notegoal/MainApplication.kt:9:8 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/android/app/src/main/java/com/alessandro/notegoal/MainApplication.kt:21:16 This declaration overrides a deprecated member but is not marked as deprecated itself. Add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/android/app/src/main/java/com/alessandro/notegoal/MainApplication.kt:21:33 'class ReactNativeHost : Any' is deprecated. Deprecated in Java.
> Task :react-native-reanimated:copyDebugJniLibsProjectOnly
> Task :react-native-gesture-handler:buildCMakeDebug[arm64-v8a]
> Task :react-native-gesture-handler:configureCMakeDebug[armeabi-v7a]
> Task :app:buildCMakeDebug[arm64-v8a]
C/C++: ninja: Entering directory `/home/expo/workingdir/build/android/app/.cxx/Debug/5y2wm2z1/arm64-v8a'
C/C++: ccache /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/bin/clang++ --target=aarch64-none-linux-android24 --sysroot=/home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/sysroot -DRN_SERIALIZABLE_STATE -Dappmodules_EXPORTS -I/home/expo/workingdir/build/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -I/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni -I/home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -I/home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -I/home/expo/workingdir/build/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni/. -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni/../../../../common/cpp -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/safeareacontext -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni/. -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni/../../../../common/cpp -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni/../../../build/generated/source/codegen/jni -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/rnscreens -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/. -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../build/generated/source/codegen/jni -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/rnsvg -I/home/expo/workingdir/build/node_modules/react-native-webview/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/react-native-webview/android/build/generated/source/codegen/jni/react/renderer/components/RNCWebViewSpec -I/home/expo/workingdir/build/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/react/renderer/components/rnworklets -isystem /home/expo/.gradle/caches/8.14.3/transforms/488fe6e480efb97ec75859f6e274282f/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/jsi/include -isystem /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -Wall -Werror -fexceptions -frtti -std=c++20 -DFOLLY_NO_CONFIG=1 -DLOG_TAG=\"ReactNative\" -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1 -MD -MT CMakeFiles/appmodules.dir/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o -MF CMakeFiles/appmodules.dir/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o.d -o CMakeFiles/appmodules.dir/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o -c /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:18:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/rnsvg.h:6:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGComponentDescriptors.h:5:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGShadowNodes.h:6:
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:11:40: error: too many template arguments for class template 'ConcreteShadowNode'
C/C++:    11 | class RNSVGConcreteShadowNode : public ConcreteShadowNode<
C/C++:       |                                        ^
C/C++:    12 |                                     concreteComponentName,
C/C++:    13 |                                     RNSVGLayoutableShadowNode,
C/C++:    14 |                                     PropsT,
C/C++:    15 |                                     ViewEventEmitter,
C/C++:    16 |                                     StateData,
C/C++:    17 |                                     false> {
C/C++:       |                                     ~~~~~~
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteShadowNode.h:33:7: note: template is declared here
C/C++:    27 | template <
C/C++:       | ~~~~~~~~~~
C/C++:    28 |     ComponentName concreteComponentName,
C/C++:       |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++:    29 |     typename BaseShadowNodeT,
C/C++:       |     ~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++:    30 |     typename PropsT,
C/C++:       |     ~~~~~~~~~~~~~~~~
C/C++:    31 |     typename EventEmitterT = EventEmitter,
C/C++:       |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++:    32 |     typename StateDataT = StateData>
C/C++:       |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++:    33 | class ConcreteShadowNode : public BaseShadowNodeT {
C/C++:       |       ^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:18:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/rnsvg.h:6:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGComponentDescriptors.h:5:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGShadowNodes.h:6:
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:19:26: error: too many template arguments for class template 'ConcreteShadowNode'
C/C++:    19 |   using BaseShadowNode = ConcreteShadowNode<
C/C++:       |                          ^
C/C++:    20 |       concreteComponentName,
C/C++:    21 |       RNSVGLayoutableShadowNode,
C/C++:    22 |       PropsT,
C/C++:    23 |       ViewEventEmitter,
C/C++:    24 |       StateData,
C/C++:    25 |       false>;
C/C++:       |       ~~~~~~
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteShadowNode.h:33:7: note: template is declared here
C/C++:    27 | template <
C/C++:       | ~~~~~~~~~~
C/C++:    28 |     ComponentName concreteComponentName,
C/C++:       |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++:    29 |     typename BaseShadowNodeT,
C/C++:       |     ~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++:    30 |     typename PropsT,
C/C++:       |     ~~~~~~~~~~~~~~~~
C/C++:    31 |     typename EventEmitterT = EventEmitter,
C/C++:       |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++:    32 |     typename StateDataT = StateData>
C/C++:       |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++:    33 | class ConcreteShadowNode : public BaseShadowNodeT {
C/C++:       |       ^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:18:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/rnsvg.h:6:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGComponentDescriptors.h:5:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGShadowNodes.h:6:
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:29:9: error: use of undeclared identifier 'BaseShadowNode'
C/C++:    29 |   using BaseShadowNode::BaseShadowNode;
C/C++:       |         ^
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:39:34: error: only virtual member functions can be marked 'override'
C/C++:    39 |   Transform getTransform() const override {
C/C++:       |                                  ^~~~~~~~
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:44:33: error: only virtual member functions can be marked 'override'
C/C++:    44 |   bool canBeTouchTarget() const override {
C/C++:       |                                 ^~~~~~~~
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:51:41: error: only virtual member functions can be marked 'override'
C/C++:    51 |   bool canChildrenBeTouchTarget() const override {
C/C++:       |                                         ^~~~~~~~
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:32:19: error: use of undeclared identifier 'BaseShadowNode'
C/C++:    32 |     auto traits = BaseShadowNode::BaseTraits();
C/C++:       |                   ^
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:40:26: error: use of undeclared identifier 'BaseShadowNode'
C/C++:    40 |     auto layoutMetrics = BaseShadowNode::getLayoutMetrics();
C/C++:       |                          ^
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:41:12: error: use of undeclared identifier 'BaseShadowNode'
C/C++:    41 |     return BaseShadowNode::getConcreteProps().resolveTransform(layoutMetrics);
C/C++:       |            ^
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:46:9: error: use of undeclared identifier 'BaseShadowNode'
C/C++:    46 |         BaseShadowNode::getConcreteProps().ViewProps::pointerEvents;
C/C++:       |         ^
C/C++: /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:53:9: error: use of undeclared identifier 'BaseShadowNode'
C/C++:    53 |         BaseShadowNode::getConcreteProps().ViewProps::pointerEvents;
C/C++:       |         ^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:12:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/./react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.h:14:
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteComponentDescriptor.h:34:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ShadowNode, facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>::value': ShadowNodeT must be a descendant of ShadowNode
C/C++:    34 |       std::is_base_of<ShadowNode, ShadowNodeT>::value,
C/C++:       |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++: /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/include/c++/v1/__type_traits/is_base_of.h:22:94: note: in instantiation of template class 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>' requested here
C/C++:    22 | struct _LIBCPP_TEMPLATE_VIS is_base_of : public integral_constant<bool, __is_base_of(_Bp, _Dp)> {};
C/C++:       |                                                                                              ^
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:12: note: in instantiation of template class 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>>' requested here
C/C++:    62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
C/C++:       |            ^
C/C++: /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:85:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>>' requested here
C/C++:    85 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>());
C/C++:       |                       ^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
C/C++: In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>>::value': ComponentDescriptorT must be a descendant of ComponentDescriptor
C/C++:    62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
C/C++:       |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++: /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:85:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>>' requested here
C/C++:    85 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>());
C/C++:       |                       ^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
C/C++: In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:66:29: error: no member named 'ConcreteShadowNode' in 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>'
C/C++:    66 |       ComponentDescriptorT::ConcreteShadowNode::Handle(),
C/C++:       |       ~~~~~~~~~~~~~~~~~~~~~~^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:12:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/./react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.h:14:
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteComponentDescriptor.h:34:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ShadowNode, facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>::value': ShadowNodeT must be a descendant of ShadowNode
C/C++:    34 |       std::is_base_of<ShadowNode, ShadowNodeT>::value,
C/C++:       |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++: /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/include/c++/v1/__type_traits/is_base_of.h:22:94: note: in instantiation of template class 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>' requested here
C/C++:    22 | struct _LIBCPP_TEMPLATE_VIS is_base_of : public integral_constant<bool, __is_base_of(_Bp, _Dp)> {};
C/C++:       |                                                                                              ^
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:12: note: in instantiation of template class 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>>' requested here
C/C++:    62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
C/C++:       |            ^
C/C++: /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:86:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>>' requested here
C/C++:    86 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGClipPathComponentDescriptor>());
C/C++:       |                       ^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
C/C++: In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>>::value': ComponentDescriptorT must be a descendant of ComponentDescriptor
C/C++:    62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
C/C++:       |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++: /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:86:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>>' requested here
C/C++:    86 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGClipPathComponentDescriptor>());
C/C++:       |                       ^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
C/C++: In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:66:29: error: no member named 'ConcreteShadowNode' in 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>'
C/C++:    66 |       ComponentDescriptorT::ConcreteShadowNode::Handle(),
C/C++:       |       ~~~~~~~~~~~~~~~~~~~~~~^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:12:
C/C++: In file included from /home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/./react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.h:14:
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteComponentDescriptor.h:34:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ShadowNode, facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>::value': ShadowNodeT must be a descendant of ShadowNode
C/C++:    34 |       std::is_base_of<ShadowNode, ShadowNodeT>::value,
C/C++:       |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++: /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/include/c++/v1/__type_traits/is_base_of.h:22:94: note: in instantiation of template class 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>' requested here
C/C++:    22 | struct _LIBCPP_TEMPLATE_VIS is_base_of : public integral_constant<bool, __is_base_of(_Bp, _Dp)> {};
C/C++:       |                                                                                              ^
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:12: note: in instantiation of template class 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>>' requested here
C/C++:    62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
C/C++:       |            ^
C/C++: /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:87:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>>' requested here
C/C++:    87 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGDefsComponentDescriptor>());
C/C++:       |                       ^
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
C/C++: In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
C/C++: In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
C/C++: /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>>::value': ComponentDescriptorT must be a descendant of ComponentDescriptor
C/C++:    62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
C/C++:       |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
C/C++: /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:87:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>>' requested here
C/C++:    87 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGDefsComponentDescriptor>());
C/C++:       |                       ^
C/C++: fatal error: too many errors emitted, stopping now [-ferror-limit=]
C/C++: 20 errors generated.
> Task :react-native-gesture-handler:buildCMakeDebug[armeabi-v7a]
> Task :react-native-gesture-handler:configureCMakeDebug[x86]
> Task :app:buildCMakeDebug[arm64-v8a] FAILED
> Task :react-native-gesture-handler:buildCMakeDebug[x86]
[Incubating] Problems report is available at: file:///home/expo/workingdir/build/android/build/reports/problems/problems-report.html
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ':app:buildCMakeDebug[arm64-v8a]'.
> com.android.ide.common.process.ProcessException: ninja: Entering directory `/home/expo/workingdir/build/android/app/.cxx/Debug/5y2wm2z1/arm64-v8a'
  [0/2] Re-checking globbed directories...
  [1/79] Building CXX object rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/States.cpp.o
  [2/79] Building CXX object rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/EventEmitters.cpp.o
  [3/79] Building CXX object rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/rnasyncstorageJSI-generated.cpp.o
  [4/79] Building CXX object rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/Props.cpp.o
  [5/79] Building CXX object rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/rnasyncstorage-generated.cpp.o
  [6/79] Building CXX object rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ShadowNodes.cpp.o
  [7/79] Building CXX object rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ComponentDescriptors.cpp.o
  [8/79] Building CXX object CMakeFiles/appmodules.dir/OnLoad.cpp.o
[9/79] Building CXX object rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.cpp.o
  [10/79] Building CXX object rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/EventEmitters.cpp.o
  [11/79] Building CXX object rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/States.cpp.o
  [12/79] Building CXX object CMakeFiles/appmodules.dir/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o
  FAILED: CMakeFiles/appmodules.dir/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o 
  ccache /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/bin/clang++ --target=aarch64-none-linux-android24 --sysroot=/home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/sysroot -DRN_SERIALIZABLE_STATE -Dappmodules_EXPORTS -I/home/expo/workingdir/build/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -I/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni -I/home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -I/home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -I/home/expo/workingdir/build/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni/. -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni/../../../../common/cpp -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni -I/home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/safeareacontext -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni/. -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni/../../../../common/cpp -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni/../../../build/generated/source/codegen/jni -I/home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/rnscreens -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/. -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../build/generated/source/codegen/jni -I/home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/rnsvg -I/home/expo/workingdir/build/node_modules/react-native-webview/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/react-native-webview/android/build/generated/source/codegen/jni/react/renderer/components/RNCWebViewSpec -I/home/expo/workingdir/build/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/. -I/home/expo/workingdir/build/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/react/renderer/components/rnworklets -isystem /home/expo/.gradle/caches/8.14.3/transforms/488fe6e480efb97ec75859f6e274282f/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/jsi/include -isystem /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -Wall -Werror -fexceptions -frtti -std=c++20 -DFOLLY_NO_CONFIG=1 -DLOG_TAG=\"ReactNative\" -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1 -MD -MT CMakeFiles/appmodules.dir/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o -MF CMakeFiles/appmodules.dir/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o.d -o CMakeFiles/appmodules.dir/home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o -c /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:18:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/rnsvg.h:6:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGComponentDescriptors.h:5:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGShadowNodes.h:6:
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:11:40: error: too many template arguments for class template 'ConcreteShadowNode'
     11 | class RNSVGConcreteShadowNode : public ConcreteShadowNode<
        |                                        ^
     12 |                                     concreteComponentName,
     13 |                                     RNSVGLayoutableShadowNode,
     14 |                                     PropsT,
     15 |                                     ViewEventEmitter,
     16 |                                     StateData,
     17 |                                     false> {
        |                                     ~~~~~~
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteShadowNode.h:33:7: note: template is declared here
     27 | template <
        | ~~~~~~~~~~
     28 |     ComponentName concreteComponentName,
        |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     29 |     typename BaseShadowNodeT,
        |     ~~~~~~~~~~~~~~~~~~~~~~~~~
     30 |     typename PropsT,
        |     ~~~~~~~~~~~~~~~~
     31 |     typename EventEmitterT = EventEmitter,
        |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     32 |     typename StateDataT = StateData>
        |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     33 | class ConcreteShadowNode : public BaseShadowNodeT {
        |       ^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:18:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/rnsvg.h:6:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGComponentDescriptors.h:5:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGShadowNodes.h:6:
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:19:26: error: too many template arguments for class template 'ConcreteShadowNode'
     19 |   using BaseShadowNode = ConcreteShadowNode<
        |                          ^
     20 |       concreteComponentName,
     21 |       RNSVGLayoutableShadowNode,
     22 |       PropsT,
     23 |       ViewEventEmitter,
     24 |       StateData,
     25 |       false>;
        |       ~~~~~~
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteShadowNode.h:33:7: note: template is declared here
     27 | template <
        | ~~~~~~~~~~
     28 |     ComponentName concreteComponentName,
        |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     29 |     typename BaseShadowNodeT,
        |     ~~~~~~~~~~~~~~~~~~~~~~~~~
     30 |     typename PropsT,
        |     ~~~~~~~~~~~~~~~~
     31 |     typename EventEmitterT = EventEmitter,
        |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     32 |     typename StateDataT = StateData>
        |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     33 | class ConcreteShadowNode : public BaseShadowNodeT {
        |       ^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:18:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/rnsvg.h:6:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGComponentDescriptors.h:5:
  In file included from /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGShadowNodes.h:6:
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:29:9: error: use of undeclared identifier 'BaseShadowNode'
     29 |   using BaseShadowNode::BaseShadowNode;
        |         ^
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:39:34: error: only virtual member functions can be marked 'override'
     39 |   Transform getTransform() const override {
        |                                  ^~~~~~~~
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:44:33: error: only virtual member functions can be marked 'override'
     44 |   bool canBeTouchTarget() const override {
        |                                 ^~~~~~~~
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:51:41: error: only virtual member functions can be marked 'override'
     51 |   bool canChildrenBeTouchTarget() const override {
        |                                         ^~~~~~~~
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:32:19: error: use of undeclared identifier 'BaseShadowNode'
     32 |     auto traits = BaseShadowNode::BaseTraits();
        |                   ^
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:40:26: error: use of undeclared identifier 'BaseShadowNode'
     40 |     auto layoutMetrics = BaseShadowNode::getLayoutMetrics();
        |                          ^
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:41:12: error: use of undeclared identifier 'BaseShadowNode'
     41 |     return BaseShadowNode::getConcreteProps().resolveTransform(layoutMetrics);
        |            ^
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:46:9: error: use of undeclared identifier 'BaseShadowNode'
     46 |         BaseShadowNode::getConcreteProps().ViewProps::pointerEvents;
        |         ^
  /home/expo/workingdir/build/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp/react/renderer/components/rnsvg/RNSVGConcreteShadowNode.h:53:9: error: use of undeclared identifier 'BaseShadowNode'
     53 |         BaseShadowNode::getConcreteProps().ViewProps::pointerEvents;
        |         ^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:12:
  In file included from /home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/./react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.h:14:
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteComponentDescriptor.h:34:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ShadowNode, facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>::value': ShadowNodeT must be a descendant of ShadowNode
     34 |       std::is_base_of<ShadowNode, ShadowNodeT>::value,
        |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/include/c++/v1/__type_traits/is_base_of.h:22:94: note: in instantiation of template class 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>' requested here
     22 | struct _LIBCPP_TEMPLATE_VIS is_base_of : public integral_constant<bool, __is_base_of(_Bp, _Dp)> {};
        |                                                                                              ^
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:12: note: in instantiation of template class 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>>' requested here
     62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
        |            ^
  /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:85:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>>' requested here
     85 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>());
        |                       ^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
  In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>>::value': ComponentDescriptorT must be a descendant of ComponentDescriptor
     62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
        |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:85:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>>' requested here
     85 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>());
        |                       ^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
  In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:66:29: error: no member named 'ConcreteShadowNode' in 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGCircleComponentName, facebook::react::RNSVGCircleProps>>'
     66 |       ComponentDescriptorT::ConcreteShadowNode::Handle(),
        |       ~~~~~~~~~~~~~~~~~~~~~~^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:12:
  In file included from /home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/./react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.h:14:
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteComponentDescriptor.h:34:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ShadowNode, facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>::value': ShadowNodeT must be a descendant of ShadowNode
     34 |       std::is_base_of<ShadowNode, ShadowNodeT>::value,
|       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/include/c++/v1/__type_traits/is_base_of.h:22:94: note: in instantiation of template class 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>' requested here
     22 | struct _LIBCPP_TEMPLATE_VIS is_base_of : public integral_constant<bool, __is_base_of(_Bp, _Dp)> {};
        |                                                                                              ^
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:12: note: in instantiation of template class 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>>' requested here
     62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
        |            ^
  /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:86:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>>' requested here
     86 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGClipPathComponentDescriptor>());
        |                       ^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
  In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>>::value': ComponentDescriptorT must be a descendant of ComponentDescriptor
     62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
        |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:86:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>>' requested here
     86 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGClipPathComponentDescriptor>());
        |                       ^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
  In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:66:29: error: no member named 'ConcreteShadowNode' in 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGClipPathComponentName, facebook::react::RNSVGClipPathProps>>'
     66 |       ComponentDescriptorT::ConcreteShadowNode::Handle(),
        |       ~~~~~~~~~~~~~~~~~~~~~~^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:12:
  In file included from /home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/./react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.h:14:
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/core/ConcreteComponentDescriptor.h:34:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ShadowNode, facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>::value': ShadowNodeT must be a descendant of ShadowNode
     34 |       std::is_base_of<ShadowNode, ShadowNodeT>::value,
        |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/include/c++/v1/__type_traits/is_base_of.h:22:94: note: in instantiation of template class 'facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>' requested here
     22 | struct _LIBCPP_TEMPLATE_VIS is_base_of : public integral_constant<bool, __is_base_of(_Bp, _Dp)> {};
        |                                                                                              ^
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:12: note: in instantiation of template class 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>>' requested here
     62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
        |            ^
  /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:87:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>>' requested here
     87 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGDefsComponentDescriptor>());
        |                       ^
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:9:
  In file included from /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.h:15:
  In file included from /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h:13:
  /home/expo/.gradle/caches/8.14.3/transforms/4b1e5db2abf1f42fa3e1b79df9a2284f/transformed/react-android-0.81.4-debug/prefab/modules/reactnative/include/react/renderer/componentregistry/ComponentDescriptorProvider.h:62:7: error: static assertion failed due to requirement 'std::is_base_of<facebook::react::ComponentDescriptor, facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>>::value': ComponentDescriptorT must be a descendant of ComponentDescriptor
     62 |       std::is_base_of<ComponentDescriptor, ComponentDescriptorT>::value,
        |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp:87:23: note: in instantiation of function template specialization 'facebook::react::concreteComponentDescriptorProvider<facebook::react::ConcreteComponentDescriptor<facebook::react::RNSVGConcreteShadowNode<facebook::react::RNSVGDefsComponentName, facebook::react::RNSVGDefsProps>>>' requested here
     87 | providerRegistry->add(concreteComponentDescriptorProvider<RNSVGDefsComponentDescriptor>());
        |                       ^
  fatal error: too many errors emitted, stopping now [-ferror-limit=]
  20 errors generated.
  [13/79] Building CXX object rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/rngesturehandler_codegenJSI-generated.cpp.o
  [14/79] Building CXX object rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ShadowNodes.cpp.o
  [15/79] Building CXX object rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/EventEmitters.cpp.o
  [16/79] Building CXX object rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/rngesturehandler_codegen-generated.cpp.o
  [17/79] Building CXX object rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/Props.cpp.o
  [18/79] Building CXX object rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ComponentDescriptors.cpp.o
  [19/79] Building CXX object rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/States.cpp.o
  [20/79] Building CXX object rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/Props.cpp.o
  [21/79] Building CXX object rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ShadowNodes.cpp.o
  ninja: build stopped: subcommand failed.
  
  C++ build system [build] failed while executing:
      /home/expo/Android/Sdk/cmake/3.22.1/bin/ninja \
        -C \
        /home/expo/workingdir/build/android/app/.cxx/Debug/5y2wm2z1/arm64-v8a \
        appmodules \
        react_codegen_rnscreens \
        react_codegen_rnsvg \
        react_codegen_safeareacontext
    from /home/expo/workingdir/build/android/app
* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.
BUILD FAILED in 6m 52s
Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.
You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.
For more on this, please refer to https://docs.gradle.org/8.14.3/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.
487 actionable tasks: 487 executed
Error: Gradle build failed with unknown error. See logs for the "Run gradlew" phase for more information.