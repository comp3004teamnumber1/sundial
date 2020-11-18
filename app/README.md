# ☀️ App

## 🚀 Getting Started

### 🏃‍♀️ Before You Start

First, make sure you have `npm` installed (included with [Node.js](https://nodejs.org/en/)) or [yarn](https://yarnpkg.com/). Then clone this repository and navigate to `/app` directory in your preferred shell. Then you can run the following command to install all dependencies:

```bash
# for node/npm
npm install
# for yarn
yarn install
```

### 🚗 Usage

To run the project, navigate to this directory and run one of the following commands:

```bash
yarn start # you can open iOS, Android, or web from here, or directly with the commands below.
yarn android
yarn ios # requires an iOS device or macOS for access to an iOS simulator
yarn web
```

You may also run the same commands using `npm` instead of yarn:

```bash
npm run start
npm run android
npm run ios
npm run web
```

## 📝 Useful Notes

### 📘 `Constants` Guide

Located in `src/components/constants.js`, this file contains a bunch of reusable useful functions and data, outlined below.

For more information on the `AsyncStorage` module, please refer [here](#-asynchronous-storage-guide).

```js
// An async function to retrieve the value of a given key from the AsyncStorage module
getStorageKey(key)

// An async function to set the given key-value pair in the AsyncStorage module
setStorageKey(key, value)

// Shorthand for getStorageKey that retrieves the session key
getSessionKey()

// An object containing various useful constants
constants = {
  SERVER_URL: string,
}

// An object containing dummy data for components
dummy = {
  weeklyViewTestPayload: array,
  hourlyViewTestPayload: array,
}
```

### 📕 Asynchronous Storage Guide

To use the AsyncStorage module, import the commands as follows:

```js
import { getStorageKey, setStorageKey } from './components/constants.js'
```

`getStorageKey(key)` accepts a string argument representing the key you're trying to find. It returns the corresponding value if found and `null` otherwise.

```js
async () => {
  const value = await getStorageKey('key');
  if (value) {
    // do something awesome!
  }
}
```

`setStorageKey(key, value)` accepts a string argument representing the key and value to set. It returns `true` if successful and `false` otherwise.

```js
async () => {
  const result = await setStorageKey('key', 'some value');
  if (result) {
    // key set successfully!
  }
}
```

#### 🔑 Current Keys

```json
{
  "session_key": "string",
  "username": "string",
  "current_location": "string",
  "units": "string",
  "saved_locations": "string in the following format: {\"place1\":null}|{\"place2\":null}|{\"place3\":null}|{\"place4\":null}|{\"place5\":null}"
}
```

## 🗂️ More Reading

- [Icon directory](https://expo.github.io/vector-icons/)
- [Expo documentation](https://docs.expo.io/)
- [NativeBase Components](https://docs.nativebase.io/Components.html)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
