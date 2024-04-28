// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDgQTzrK3BZ9WKDpHqd__532mbKMWseQGM",
    authDomain: "electronicimage-ecee4.firebaseapp.com",
    projectId: "electronicimage-ecee4",
    storageBucket: "electronicimage-ecee4.appspot.com",
    messagingSenderId: "409184499276",
    appId: "1:409184499276:web:3adf069ccb48d5bda1e6e9",
    measurementId: "G-VNX4YLKYFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const ImageDB = getStorage(app)