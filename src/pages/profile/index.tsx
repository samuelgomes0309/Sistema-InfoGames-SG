import SideBar from "../../components/sidebar";
import avatar from "../../assets/avatar.png";
import { Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/authContexts";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../../services/firebase";
import { updateProfile } from "firebase/auth";

export default function Profile() {
	const { user, setUser } = useContext(AuthContext)!;
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [imgFile, setImgfile] = useState<File | null>(null);
	const [newAvatar, setNewAvatar] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const nav = useNavigate();
	useEffect(() => {
		const sub = () => {
			console.log(user);
			if (!user) {
				nav("/");
				return;
			}
			setName(user.name);
			setEmail(user.email);
			setNewAvatar(user?.avatarUrl ?? null);
		};
		sub();
	}, [nav, user]);
	function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files;
		if (file !== null) {
			if (file[0].type === "image/jpeg" || file[0].type === "image/png") {
				const url = URL.createObjectURL(file[0]);
				setNewAvatar(url);
				setImgfile(file[0]);
			}
		} else {
			toast.error("Não foi possivel adicionar uma foto de perfil!");
			setNewAvatar(null);
		}
	}
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!name.trim()) {
			toast.warn("Nome não pode estar vazio.");
			return;
		}
		setLoading(true);
		try {
			let photoURL = newAvatar;
			if (imgFile) {
				const imgRef = ref(storage, `images/${user?.uid}/${imgFile?.name}`);
				await uploadBytes(imgRef, imgFile);
				photoURL = await getDownloadURL(imgRef);
			}
			const currentUser = auth.currentUser;
			if (!currentUser) return;
			await updateProfile(currentUser, {
				displayName: name,
				photoURL: photoURL ?? undefined,
			});
			setUser((prevUser) => {
				if (!prevUser) return null;
				return {
					...prevUser,
					name,
					avatarUrl: photoURL ?? prevUser.avatarUrl,
				};
			});
			toast.success("Perfil atualizado com sucesso.");
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error("Erro ao salvar perfil, tente novamente.");
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="bg-primaryColor min-h-dvh min-w-full">
			<SideBar />
			<main className="mx-3 min-h-96 rounded-xl border-2 border-gray-700 px-3 py-5 text-white shadow-2xl">
				<h2 className="mb-5 text-2xl">My profile:</h2>
				<form
					className="flex max-w-3xs flex-col gap-3.5"
					onSubmit={(e) => handleSubmit(e)}
				>
					<div className="mb-5 flex w-full max-w-96 items-center justify-center">
						<label className="flex cursor-pointer items-center justify-center">
							<img
								src={newAvatar == null ? avatar : newAvatar}
								className="h-40 w-40 rounded-full object-contain shadow-2xl shadow-black"
							/>
							<input
								type="file"
								className="hidden"
								onChange={(e) => handleAvatar(e)}
								accept="image/*"
								multiple={false}
							/>
							<Plus
								className="absolute z-20 transition-all duration-500 hover:scale-105"
								size={45}
								color="#087"
							/>
						</label>
					</div>
					<label>Name:</label>
					<input
						className="mb-2 w-64 rounded-md border-0 bg-zinc-950 px-2 py-3 transition-all duration-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed"
						placeholder="Nome do usuario"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<label>Email:</label>
					<input
						disabled
						className="mb-2 w-64 rounded-md border-0 bg-zinc-900 px-2 py-3 transition-all duration-500 disabled:cursor-not-allowed"
						placeholder="Email do usuario"
						value={email}
					/>
					<button
						disabled={loading}
						className="flex cursor-pointer items-center justify-center rounded-xs bg-blue-950 p-3 text-xl font-bold text-white transition-all duration-500 disabled:cursor-not-allowed disabled:hover:bg-blue-950"
					>
						<span
							className={`transition-all duration-500 ${loading ? "animate-pulse" : ""}`}
						>
							{loading ? "Carregando..." : "Enviar"}
						</span>
					</button>
				</form>
			</main>
		</div>
	);
}
