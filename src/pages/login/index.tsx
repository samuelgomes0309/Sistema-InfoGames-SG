export default function Login() {
	return (
		<div className="bg-primaryColor flex min-h-dvh bg-gradient-to-b from-70% to-blue-950 p-5">
			<div className="bg-primaryLight mx-auto my-auto flex min-h-96 w-full max-w-lg flex-col justify-center rounded-xs border border-gray-700 px-3 py-7">
				<form className="flex w-full flex-col">
					<input
						className="mb-2 rounded-xs bg-white px-2 py-3 outline"
						placeholder="Nome"
					/>
					<input
						className="mb-2 rounded-xs bg-white px-2 py-3 outline"
						placeholder="email"
					/>
					<input
						className="mb-2 rounded-xs bg-white px-2 py-3 outline"
						placeholder="senha"
					/>
					<button className="cursor-pointer rounded-xs bg-zinc-950 p-3 text-xl font-bold text-white transition-all duration-500 hover:bg-zinc-800">
						Entrar
					</button>
				</form>
				<button className="mt-2 cursor-pointer text-gray-300 transition-all duration-500 hover:text-gray-400">
					Não possui uma conta? Cadastre-se
				</button>
			</div>
		</div>
	);
}
