import { useCallback, useEffect, useRef, useState } from "react";
import SideBar from "../../components/sidebar";
import { api } from "../../services/api";
import ItemCategory from "../../components/categorys";
import GameInfo from "../../components/games";
export interface GenreProps {
	id: number;
	name: string;
	slug: string;
	games_count: number;
	image_background: string;
}
export interface GamesProps {
	id: number;
	name: string;
	slug: string;
	platforms: PlatformProps[];
	rating: number;
	rating_top: number;
	released: string;
	background_image: string;
}
interface PlatformProps {
	id: number;
	name: string;
	slug: string;
}
export default function Home() {
	const [listCategory, setListCategory] = useState<GenreProps[] | []>([]);
	const bottomRef = useRef<HTMLDivElement>(null);
	const [page, setPage] = useState<number>(1);
	const [games, setGames] = useState<GamesProps[] | []>([]);

	const [loadingGames, setLoadingGames] = useState(false);
	const [loadingApp, setLoadingApp] = useState(true);
	const allGenre = {
		id: -1,
		name: "All",
		slug: "All",
		games_count: 0,
		image_background: "",
	};
	const [selectedCategory, setSelectedCategory] = useState<GenreProps | null>(
		allGenre
	);
	const loadGames = useCallback(
		async (pageNumber: number = 1, genre_id?: number) => {
			if (loadingGames) return;
			setLoadingGames(true);
			try {
				const response = await api.get("/games", {
					params: {
						key: import.meta.env.VITE_API_KEY,
						ordering: "rating_top",
						page: pageNumber,
						page_size: 20,
						genres: genre_id === -1 ? undefined : genre_id,
					},
				});
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
		[loadingGames]
	);
	useEffect(() => {
		const sub = async () => {
			await loadCategorys();
			await loadGames();
			setLoadingApp(false);
		};
		sub();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!bottomRef.current) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (loadingGames) return;
				if (entries[0].isIntersecting) {
					const nextPage = page + 1;
					loadGames(nextPage, selectedCategory?.id);
				}
			},
			{ root: null, rootMargin: "10px", threshold: 0.1 }
		);
		if (bottomRef.current) observer.observe(bottomRef.current);
		return () => {
			observer.disconnect();
		};
	}, [bottomRef, loadingGames, selectedCategory, loadGames, page]);

	async function loadCategorys() {
		try {
			const response = await api.get("/genres", {
				params: {
					key: import.meta.env.VITE_API_KEY,
					ordering: "name",
				},
			});
			if (response.data) {
				setListCategory(response.data.results);
			}
		} catch (error) {
			console.log(error);
		}
	}
	async function handleSelectGenre(genre: GenreProps) {
		setGames([]);
		setSelectedCategory(genre);
		setPage(1);
		await loadGames(1, genre.id);
	}

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
			<aside className="p-3.5 text-white">
				<h1 className="text-2xl">Jogos em alta</h1>
				<aside className="my-5 flex items-center gap-1.5">
					<nav className="flex flex-wrap gap-2">
						<ItemCategory
							genre={allGenre}
							selected={selectedCategory}
							setSelected={handleSelectGenre}
						/>
						{listCategory?.map((item) => (
							<ItemCategory
								key={item.id}
								genre={item}
								selected={selectedCategory}
								setSelected={handleSelectGenre}
							/>
						))}
					</nav>
				</aside>
				{games && (
					<>
						<main className="mt-3.5 grid grid-cols-none gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{games.map((game) => (
								<GameInfo key={game.id} item={game} />
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
