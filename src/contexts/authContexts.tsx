import { createContext, useEffect, useState, type ReactNode } from "react";
import type { SigninData, SignupData } from "../pages/login";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";

interface AuthContextProps {
	user: UserProps | null;
	handleSignup: (data: SignupData) => Promise<boolean>;
	handleSignin: (data: SigninData) => Promise<boolean>;
	logOut: () => Promise<void>;
	setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
	loadingAuth: boolean;
}

interface UserProps {
	uid: string;
	name: string;
	email: string;
	avatarUrl: string | null;
}
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextProps | null>(null);

interface ProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: ProviderProps) {
	const [user, setUser] = useState<UserProps | null>(null);
	const [loadingAuth, setLoadingAuth] = useState(false);
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser({
					email: user.email ?? "",
					uid: user.uid,
					name: user.displayName ?? "",
					avatarUrl: user.photoURL,
				});
			}
		});
	}, []);
	async function handleSignup(data: SignupData) {
		if (!data) return false;
		try {
			setLoadingAuth(true);
			const response = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);
			await updateProfile(response.user, {
				displayName: data.name,
			});
			setUser({
				email: data.email,
				uid: response.user.uid,
				name: response.user.displayName || "",
				avatarUrl: response.user.photoURL,
			});
			setLoadingAuth(false);
			return true;
		} catch (error) {
			console.log(error);
			setLoadingAuth(false);
			return false;
		}
	}
	async function handleSignin(data: SigninData) {
		if (!data) return false;
		try {
			setLoadingAuth(true);
			const response = await signInWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);
			setUser({
				email: data.email,
				uid: response.user.uid,
				name: response.user.displayName || "",
				avatarUrl: response.user.photoURL,
			});
			setLoadingAuth(false);
			return true;
		} catch (error) {
			setLoadingAuth(false);
			console.log(error);
			return false;
		}
	}
	async function logOut() {
		try {
			await signOut(auth);
			setUser(null);
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<AuthContext.Provider
			value={{ handleSignin, user, handleSignup, loadingAuth, logOut, setUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}
