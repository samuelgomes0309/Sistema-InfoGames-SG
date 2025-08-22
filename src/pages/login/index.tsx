import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/authContexts";
import { useNavigate } from "react-router";

export interface SignupData {
	name: string;
	email: string;
	password: string;
}
export interface SigninData {
	email: string;
	password: string;
}

export default function Login() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState(false);
	const textBtn = isLogin ? "Entrar" : "Cadastrar";
	const { handleSignin, handleSignup, loadingAuth } = useContext(AuthContext)!;
	const nav = useNavigate();
	function handleIsLogin() {
		setIsLogin(!isLogin);
		setEmail("");
		setName("");
		setPassword("");
	}
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (isLogin) {
			if (!email.trim() || !password.trim()) {
				toast.warning("Necesario preencher todos os campos...");
				return;
			}
			const data: SigninData = {
				email,
				password,
			};
			const result = await handleSignin(data);
			if (result) {
				toast.success("Logado com sucesso!");
				nav("/");
				return;
			} else {
				toast.error(
					"Erro ao tentar logar o usuario! Verifique os dados inseridos"
				);
			}
			return;
		} else {
			if (!name.trim() || !email.trim() || !password.trim()) {
				toast.warning("Necesario preencher todos os campos...");
				return;
			}
			const data: SignupData = {
				email,
				name,
				password,
			};
			const result = await handleSignup(data);
			if (result) {
				toast.success("Cadastrado com sucesso!");
				nav("/");
				return;
			} else {
				toast.error("Erro ao tentar cadastrar o usuario!");
			}
			return;
		}
	}
	const loader = () => {
		return (
			<div className="h-8 w-8 animate-spin rounded-full border border-gray-500 border-t-green-500" />
		);
	};

	return (
		<div className="bg-primaryColor flex min-h-dvh bg-gradient-to-b from-70% to-blue-950 p-5">
			<div className="bg-primaryLight mx-auto my-auto flex min-h-96 w-full max-w-lg flex-col items-center justify-center rounded-xl border border-gray-700 px-3 py-7 shadow shadow-gray-900 inset-shadow-zinc-100">
				<h1 className="mb-8 text-3xl font-bold text-white">
					{isLogin ? "Login" : "Cadastro"}
				</h1>
				<form
					className="flex w-full flex-col"
					onSubmit={(e) => handleSubmit(e)}
				>
					{!isLogin && (
						<input
							className="mb-2 rounded-xs bg-white px-2 py-3 ring-green-500 outline focus:ring-2 disabled:cursor-not-allowed"
							placeholder="Digite seu nome"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={loadingAuth}
						/>
					)}
					<input
						className="mb-2 rounded-xs bg-white px-2 py-3 ring-green-500 outline focus:ring-2 disabled:cursor-not-allowed"
						placeholder="Digite seu email"
						type="email"
						value={email}
						disabled={loadingAuth}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						className="mb-2 rounded-xs bg-white px-2 py-3 ring-green-500 outline focus:ring-2 disabled:cursor-not-allowed"
						placeholder="Digite sua senha"
						type="password"
						value={password}
						disabled={loadingAuth}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						disabled={loadingAuth}
						type="submit"
						className="flex cursor-pointer items-center justify-center rounded-xs bg-zinc-950 p-3 text-xl font-bold text-white transition-all duration-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:hover:bg-zinc-950"
					>
						{loadingAuth ? loader() : textBtn}
					</button>
				</form>
				<button
					onClick={handleIsLogin}
					disabled={loadingAuth}
					className="mt-2 cursor-pointer text-gray-300 transition-all duration-500 hover:text-white disabled:cursor-not-allowed"
				>
					{isLogin
						? "Não possui uma conta? Cadastre-se"
						: "Já possui uma conta? Faça o login"}
				</button>
			</div>
		</div>
	);
}
