# Gurav Samaj - React Native Mobile App

This project leverages a clean architecture approach using **React Native**, **TypeScript**, **Expo**, **Redux Toolkit**, and **React Navigation** to deliver a top-tier mobile application tailored for the Gurav Samaj community.

## Features
- **Panchang & Astronomical Calculations**: Built-in logic leveraging `astronomy-engine` for exact sun/moon coordinates based on geolocation.
- **Offline Reliability**: Redux Persist provides caching and persistence of app state (like Theme, Auth Data, Cached Panchang).
- **Theming**: Fully responsive dark/light mode context following Saffron/Orange UI guidelines.
- **Authentication**: Firebase integrated configuration for Phone OTP & Email.
- **Community**: Mock architecture built and ready for Firestore integration.

---

## 🚀 Environment Variable Config
1. Create a `.env` file at the root of the project.
2. Fill out Firebase keys:

```env
EXPO_PUBLIC_FIREBASE_API_KEY="your-api-key"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="gurav-samaj-app.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="gurav-samaj-app"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="gurav-samaj-app.appspot.com"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
EXPO_PUBLIC_FIREBASE_APP_ID="your-app-id"
```
*Note: In `src/data/firebase/config.ts`, substitute the hardcoded dummy values with `process.env.EXPO_PUBLIC_FIREBASE_API_KEY`.*

---

## 🔥 Firebase Setup Guide

1. **Create Project**: Go to [Firebase Console](https://console.firebase.google.com/) and create a project named "Gurav Samaj App".
2. **Setup Authentication**:
   - Navigate to Authentication > Sign-in method.
   - Enable **Phone** (OTP) and **Email/Password**.
3. **Setup Firestore Database**:
   - Go to Firestore Database > Create Database.
   - Start in Test Mode initially, then configure rules:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /announcements/{ann} { allow read: if true; allow write: if request.auth.token.admin == true; }
         match /users/{user} { allow read: if request.auth != null; allow write: if request.auth.uid == user; }
       }
     }
     ```
4. **Setup Apps**: Add an iOS app (`com.guravsamaj.app`) and an Android app (`com.guravsamaj.app`) in project settings to generate GoogleService-Info.plist and google-services.json for push notifications.

---

## 🛠️ Build Instructions for Android & iOS

This project is built atop Expo (SDK 52), making builds entirely seamless through EAS (Expo Application Services).

### Development
To run locally:
```bash
npm install
npx expo start
```
Use the Expo Go app on iOS/Android, or press `a` to open Android Emulator, `i` for iOS Simulator.

### Production Builds (EAS)
1. Install EAS CLI: `npm install -g eas-cli`
2. Login to your Expo account: `eas login`
3. Configure the project: `eas build:configure`

#### Android APK Build
To create an installable `.apk` file for testing:
```bash
eas build -p android --profile preview
```
To build for Play Store (.aab):
```bash
eas build -p android --profile production
```

#### iOS Build
Requires an Apple Developer Account.
```bash
eas build -p ios --profile production
```

## Architecture
- `src/domain`: Core typescript models and abstract interfaces.
- `src/data`: API interactions, firebase implementations.
- `src/core`: Utility functions, specific business logic (e.g. Panchang), constants, and themes.
- `src/presentation`: React Native screens, reusable UI components, Redux logic, and navigators. This follows the separation of concern principle.
