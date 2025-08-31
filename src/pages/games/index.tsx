import { useCallback, useContext, useEffect, useState } from "react";
import SideBar from "../../components/sidebar";
import { AuthContext } from "../../contexts/authContexts";
import { collection, getDocs, query } from "firebase/firestore";
import type { FavoriteProps, GamesProps } from "../home";
import { db } from "../../services/firebase";
import { api } from "../../services/api";
import GameInfo from "../../components/games";

export default function MyGames() {
	const [myGames, setMyGames] = useState<GamesProps[]>([]);
	const [favorites, setFavorites] = useState<FavoriteProps[]>([]);
	const { user } = useContext(AuthContext)!;
	const [loading, setLoading] = useState(true);
	const loadGames = useCallback(async () => {
		if (!user?.uid) {
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const q = query(collection(db, "myGames", user.uid, "favorites"));
			const response = await getDocs(q);
			if (response.empty) {
				setFavorites([]);
				setMyGames([]);
				return;
			}
			const newFavorites: FavoriteProps[] = [];
			const gamesPromises = response.docs.map(async (doc) => {
				const data = doc.data() as FavoriteProps;
				newFavorites.push(data);
				const responseGame = await api.get(`/games/${data.game_id}`, {
					params: { key: import.meta.env.VITE_API_KEY },
				});
				return responseGame.data;
			});
			const gamesData = await Promise.all(gamesPromises);
			setFavorites(newFavorites);
			setMyGames(gamesData);
		} catch (error) {
			console.log("Erro ao carregar jogos favoritados:", error);
		} finally {
			setLoading(false);
		}
	}, [user]);
	useEffect(() => {
		loadGames();
	}, [user, loadGames]);
	if (loading) {
		return (
			<div className="bg-primaryColor flex min-h-dvh min-w-full items-center justify-center">
				<div className="h-20 w-20 animate-spin rounded-full border-2 border-t-green-500" />
			</div>
		);
	}
	return (
		<div className="bg-primaryColor min-h-dvh min-w-full text-white">
			<SideBar />
			{myGames.length !== 0 && (
				<>
					<h1 className="px-4 text-xl font-semibold text-white">Favoritos</h1>
					<main className="mt-3.5 grid grid-cols-none gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{myGames.map((game) => (
							<GameInfo
								key={game.id}
								item={game}
								isFavorite={favorites.some((f) => f.game_id === game.id)}
								loadFav={loadGames}
								length={favorites.length}
							/>
						))}
					</main>
				</>
			)}
			{myGames.length === 0 && (
				<div className="mt-20 flex items-center justify-center px-4 pb-32 text-xl font-semibold text-white">
					<p>Não possui jogos favoritados</p>
				</div>
			)}
		</div>
	);
}
