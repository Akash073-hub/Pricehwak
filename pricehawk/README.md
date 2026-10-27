# PriceHawk

PriceHawk is a React Native Community CLI app. It uses native Android and iOS projects; it does not use Expo.

## Run on an Android phone

Install Node.js 22.11 or newer, Android Studio with the Android SDK, and configure `ANDROID_HOME`/`ANDROID_SDK_ROOT` and `adb` in your shell. On the phone, enable Developer options and USB debugging, connect it by USB, and accept the debugging prompt.

From this folder, check that the phone is detected:

```bash
adb devices
```

The phone should appear with the status `device`. Then start Metro in one terminal:

```bash
npm start
```

In a second terminal, build, install, and launch the app:

```bash
npm run android
```

## Run on an iPhone

On macOS, install Xcode and CocoaPods. Install the iOS native dependencies once:

```bash
cd ios
pod install
cd ..
```

Connect and trust the iPhone, then run:

```bash
npm run ios
```

## Packages

The project dependencies are declared in `package.json` and locked in `package-lock.json`. Install them with `npm install`. React Navigation powers the tabs, `react-native-svg` draws the price chart, AsyncStorage saves app data, and `react-native-safe-area-context` handles safe areas.
