import { Save, Star, Trash } from "lucide-react";
import type { GamesProps } from "../../pages/home";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContexts";
import { toast } from "react-toastify";
import { db } from "../../services/firebase";
interface Props {
	item: GamesProps;
	isFavorite: boolean;
	length: number;
	loadFav: () => void;
}

export default function GameInfo({ item, isFavorite, loadFav, length }: Props) {
	const { user } = useContext(AuthContext)!;
	const [loading, setLoading] = useState(false);
	async function handleDeleteOrSave() {
		if (!user?.uid) {
			toast.warn(
				"Acesso negado! Para salvar algum jogo é necessario realizar o login"
			);
			return;
		}
		try {
			setLoading(true);
			const docRef = doc(db, "myGames", user.uid, "favorites", `${item.id}`);
			if (isFavorite) {
				await deleteDoc(docRef);
				loadFav();
				toast.success("Favorito deletado com sucesso...");
				return;
			}
			if (length === 5) {
				toast.warning(
					"Você só pode salvar até 5 jogos. Apague um favorito para trocar."
				);
				return;
			}
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				if (docSnap.data().game_id === item.id) {
					toast.error("Jogo já está salvo...");
					return;
				}
			}
			await setDoc(docRef, {
				uid: user.uid,
				game: item.name,
				game_id: item.id,
			});
			loadFav();
			toast.success("Jogo salvo com sucesso!");
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="flex min-h-80 flex-col justify-center rounded border border-transparent bg-transparent p-2">
			<img
				className="h-48 w-full rounded object-cover transition-all duration-500 hover:scale-105 hover:cursor-pointer md:h-56 lg:h-64"
				src={item.background_image}
			/>
			<div className="my-2 flex justify-between">
				<span className="line-clamp-1 text-2xl">{item.name}</span>
				<button
					disabled={loading}
					className="ml-1 cursor-pointer transition-all duration-500 hover:scale-105 hover:text-green-500"
					onClick={handleDeleteOrSave}
				>
					{isFavorite ? (
						<Trash className="transition-all duration-500 hover:text-red-500" />
					) : (
						<Save />
					)}
				</button>
			</div>
			<div className="flex w-max gap-2 rounded-full border p-1 px-3 text-yellow-300">
				<span>{item.rating}</span>
				<Star />
			</div>
		</div>
	);
}
