import { useContext, useEffect, useRef, useState } from "react";
import type { FavoriteProps, GamesProps } from "../home";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import SideBar from "../../components/sidebar";
import {
	ArrowBigLeft,
	ArrowBigRight,
	Gamepad,
	Save,
	Trash,
} from "lucide-react";
import { AuthContext } from "../../contexts/authContexts";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";

interface DetailGameProps extends GamesProps {
	description: string;
	name_original: string;
	metacritic: number;
	released: string;
	platforms: GamePlatform[];
}
export interface ImageProps {
	id: number;
	image: string;
}

export interface Platform {
	id: number;
	name: string;
	slug: string;
	games_count: number;
	image: string | null;
	image_background: string;
	year_start: number | null;
	year_end: number | null;
}
export interface GamePlatform {
	platform: Platform;
}

export default function Detail() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { user } = useContext(AuthContext)!;
	const [loading, setLoading] = useState(false);
	const [game, setGame] = useState<DetailGameProps | null>(null);
	const [screenshots, setScreenshots] = useState<ImageProps[] | null>();
	const { id } = useParams();
	const nav = useNavigate();
	const [loadingApp, setLoadingApp] = useState(true);
	const [isFavorite, setIsFavorite] = useState(false);
	const scrollLeft = () => {
		if (containerRef.current) {
			containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
		}
	};
	const scrollRight = () => {
		if (containerRef.current) {
			containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
		}
	};
	function handlePlatformIcon(item: GamePlatform) {
		return (
			<div className="flex items-center gap-3.5">
				<span> {item.platform.name}</span>
				<Gamepad />
			</div>
		);
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	async function handleFav(game_id: number) {
		if (!user) return;
		try {
			const q = query(collection(db, "myGames", user.uid, "favorites"));
			const response = await getDocs(q);
			if (!response.empty) {
				const newFavorites: FavoriteProps[] = [];
				response.docs.forEach((doc) => {
					newFavorites.push(doc.data() as FavoriteProps);
				});
				setIsFavorite(newFavorites.some((game) => game.game_id === game_id));
			} else setIsFavorite(false);
		} catch (error) {
			console.log("Erro ao carregar jogos favoritados:", error);
		}
	}
	async function handleDeleteOrSave() {
		if (!user?.uid) {
			toast.warn(
				"Acesso negado! Para salvar algum jogo é necessario realizar o login"
			);
			return;
		}
		if (!game) {
			return;
		}
		try {
			setLoading(true);
			const docRef = doc(db, "myGames", user.uid, "favorites", `${id}`);
			if (isFavorite) {
				await deleteDoc(docRef);
				await handleFav(Number(id));
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
				if (docSnap.data().game_id === game.id) {
					toast.error("Jogo já está salvo...");
					return;
				}
			}
			await setDoc(docRef, {
				uid: user.uid,
				game: game.name,
				game_id: game.id,
			});
			handleFav(game.id);
			toast.success("Jogo salvo com sucesso!");
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		if (!id) {
			nav("/");
			return;
		}
		const sub = async () => {
			try {
				const response = await api.get(`/games/${id}`, {
					params: {
						key: import.meta.env.VITE_API_KEY,
					},
				});
				const responseImg = await api.get(`/games/${id}/screenshots`, {
					params: {
						key: import.meta.env.VITE_API_KEY,
					},
				});
				if (responseImg.data.count === 0) {
					setScreenshots(null);
				} else {
					setScreenshots(responseImg.data.results);
				}
				setGame(response.data);
				await handleFav(Number(id));
			} catch (error) {
				toast.error("Erro ao achar informações sobre o jogo");
				console.log("Erro ao achar informações sobre o jogo", error);
				nav("/");
			} finally {
				setLoadingApp(false);
			}
		};
		sub();
	}, [handleFav, id, nav]);
	if (loadingApp) {
		return (
			<div className="bg-primaryColor flex min-h-dvh min-w-full items-center justify-center">
				<div className="h-20 w-20 animate-spin rounded-full border-2 border-t-green-500" />
			</div>
		);
	}
	return (
		<div className="bg-primaryColor min-h-dvh min-w-full pb-12">
			<SideBar />
			<main className="flex flex-col p-3.5 text-white">
				<div className="flex">
					<h1 className="mx-auto my-3 text-3xl">{game?.name}</h1>
					{!loading && (
						<button
							onClick={handleDeleteOrSave}
							className="mr-5 cursor-pointer transition-all duration-500 hover:scale-105 hover:text-green-500"
						>
							{isFavorite ? (
								<Trash className="transition-all duration-500 hover:text-red-500" />
							) : (
								<Save />
							)}
						</button>
					)}
				</div>
				<div className="relative mx-auto my-5 w-full">
					<button
						onClick={scrollLeft}
						className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
					>
						<ArrowBigLeft />
					</button>
					<button
						onClick={scrollRight}
						className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
					>
						<ArrowBigRight />
					</button>
					<div
						ref={containerRef}
						className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-scroll scroll-smooth"
					>
						{screenshots?.map((item) => (
							<div
								key={item.id}
								className="min-w-[320px] flex-shrink-0 snap-center overflow-hidden rounded-xl shadow-lg"
							>
								<img
									src={item.image}
									alt={`screenshot-${item.id}`}
									className="h-80 w-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>
				<div dangerouslySetInnerHTML={{ __html: game?.description || "" }} />
				<div className="my-5 flex flex-col flex-wrap justify-center gap-2">
					<h3 className="text-xl">Platforms:</h3>
					{game?.platforms.map((item) => (
						<div key={item.platform.id}> {handlePlatformIcon(item)}</div>
					))}
				</div>
			</main>
		</div>
	);
}
