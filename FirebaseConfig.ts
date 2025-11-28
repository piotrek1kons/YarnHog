import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOv-v5af6zOakZ8RGWwRsFSYw7xPbk-wg",
  authDomain: "yarnhog-5feac.firebaseapp.com",
  projectId: "yarnhog-5feac",
  storageBucket: "yarnhog-5feac.firebasestorage.app",
  messagingSenderId: "1015166784446",
  appId: "1:1015166784446:web:3df3ec502d67f2723f9fef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);