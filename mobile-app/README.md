# M-Pesa POS Mobile App

## What was built
- A mobile-first React/Vite app for quick M-Pesa payments on Android phones.
- Capacitor packaging for Android deployment.
- A simple pay form, status card, and recent activity list.

## Run locally
```bash
cd mobile-app
npm install
npm run dev
```

## Build web assets
```bash
npm run build
```

## Generate Android project
```bash
npx cap add android
npx cap sync android
```

## Build Android app
```bash
npx cap build android
```

## Important note
The Android build in this environment is currently blocked by a Java/Gradle compatibility issue:
- Installed Java runtime: version 25
- Gradle requires a compatible JDK version, usually Java 17 or 21.

If Android Studio is installed, set the project JDK to the bundled JetBrains Runtime or a Java 17/21 JDK before building.
