import { useCallback, useContext, useEffect, useRef, useState } from "react";
import SideBar from "../../components/sidebar";
import { AuthContext } from "../../contexts/authContexts";
import type { FavoriteProps, GamesProps } from "../home";
import { collection, getDocs, query } from "firebase/firestore";
import { api } from "../../services/api";
import GameInfo from "../../components/games";
import { db } from "../../services/firebase";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

export default function Explore() {
	const bottomRef = useRef<HTMLDivElement>(null);
	const [page, setPage] = useState<number>(1);
	const [games, setGames] = useState<GamesProps[] | []>([]);
	const { user } = useContext(AuthContext)!;
	const [favorites, setFavorites] = useState<FavoriteProps[] | []>([]);
	const [favoritesLength, setFavoritesLength] = useState(0);
	const [loadingGames, setLoadingGames] = useState(false);
	const [name, setName] = useState("");
	const loadFavorites = useCallback(async () => {
		if (!user) return;
		try {
			const q = query(collection(db, "myGames", user.uid, "favorites"));
			const response = await getDocs(q);
			if (!response.empty) {
				const newFavorites: FavoriteProps[] = [];
				let length = 0;
				response.docs.forEach((doc) => {
					newFavorites.push(doc.data() as FavoriteProps);
					length++;
				});
				setFavorites(newFavorites);
				setFavoritesLength(length);
			} else {
				setFavorites([]);
			}
		} catch (error) {
			console.log("Erro ao carregar jogos favoritados:", error);
		}
	}, [user]);
	useEffect(() => {
		if (user) {
			loadFavorites();
		}
	}, [user, loadFavorites]);
	const loadGames = useCallback(
		async (pageNumber: number = 1, gameName: string) => {
			if (loadingGames) return;
			setLoadingGames(true);
			try {
				if (!name.trim()) {
					return;
				}
				const response = await api.get("/games", {
					params: {
						key: import.meta.env.VITE_API_KEY,
						ordering: "rating_top",
						page: pageNumber,
						search: gameName,
						search_precise: true,
						page_size: 20,
					},
				});
				if (response.data.results.length === 0) {
					toast.error("Não foi encontrado nenhum jogo com esse nome...");
				}
				if (pageNumber === 1) {
					// primeira página -> substitui
					setGames(response.data.results);
				} else {
					// concatena, evitando duplicados
					setGames((prev) => {
						const newGames = response.data.results.filter(
							(game: GamesProps) => !prev.some((g) => g.id === game.id)
						);
						return [...prev, ...newGames];
					});
				}
				setPage(pageNumber);
			} catch (error) {
				console.log("Erro ao carregar jogos:", error);
			} finally {
				setLoadingGames(false);
			}
		},
		[loadingGames, name]
	);
	async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		await loadGames(1, name);
	}
	useEffect(() => {
		if (!bottomRef.current) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (loadingGames) return;
				if (games.length > 0 && games.length < 20) return;
				if (entries[0].isIntersecting) {
					const nextPage = page + 1;
					loadGames(nextPage, name);
				}
			},
			{ root: null, rootMargin: "10px", threshold: 0.1 }
		);
		if (bottomRef.current) observer.observe(bottomRef.current);
		return () => {
			observer.disconnect();
		};
	}, [bottomRef, loadingGames, loadGames, page, name, games.length]);
	return (
		<div className="bg-primaryColor min-h-dvh min-w-full pb-12">
			<SideBar />
			<aside className="p-3.5 text-white">
				<form
					className="my-5 flex items-center justify-center gap-3"
					onSubmit={(e) => handleSearch(e)}
				>
					<input
						className="mb-2 w-64 rounded-xs border-0 bg-zinc-950 px-2 py-3 transition-all duration-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed"
						placeholder="Procure seu jogo"
						disabled={loadingGames}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<button
						type="submit"
						disabled={loadingGames}
						className="flex cursor-pointer items-center justify-center transition-all duration-500 hover:scale-105 hover:text-green-500 disabled:cursor-not-allowed"
					>
						<Search size={35} />
					</button>
				</form>
				{games.length > 0 && (
					<>
						<main className="mt-3.5 grid grid-cols-none gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{games.map((game) => (
								<GameInfo
									key={game.id}
									item={game}
									length={favoritesLength}
									isFavorite={favorites.some((f) => f.game_id === game.id)}
									loadFav={loadFavorites}
								/>
							))}
						</main>
						<div ref={bottomRef} />
					</>
				)}
			</aside>
			<footer className="mt-12">
				{loadingGames && (
					<div className="mx-auto my-auto h-20 w-20 animate-spin items-center justify-center rounded-full border-2 border-t-green-500" />
				)}
			</footer>
		</div>
	);
}
