import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyAqfn6EEEblipPy_NvYRtOjKg_EB_sWrMA",
	authDomain: "games-sg.firebaseapp.com",
	projectId: "games-sg",
	storageBucket: "games-sg.firebasestorage.app",
	messagingSenderId: "227362853134",
	appId: "1:227362853134:web:c9af3f455c47069e5c875f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
