import {
	GamepadIcon,
	HomeIcon,
	Search,
	SquareArrowRight,
	SquareChevronDown,
	SquareChevronUp,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import avatar from "../../assets/avatar.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContexts";

export default function SideBar() {
	const location = useLocation();
	const { user, logOut } = useContext(AuthContext)!;
	const [miniModalVisible, setMiniModalVisible] = useState(false);
	return (
		<header className="flex w-full flex-col px-5 text-black sm:flex-row sm:items-center">
			<nav className="flex flex-col items-start justify-start gap-14 bg-transparent p-5 sm:mx-auto sm:my-auto sm:flex-row sm:justify-center">
				<Link
					to={"/"}
					className={`border-b-2 transition-all duration-500 hover:border-b-white ${
						location.pathname === "/"
							? "flex items-center gap-3.5 border-blue-900 p-2 font-semibold text-white"
							: "flex items-center gap-3.5 border-transparent p-2 text-zinc-500"
					}`}
				>
					<HomeIcon
						size={20}
						color={location.pathname === "/" ? "#1c398e" : "#71717b "}
					/>
					Home
				</Link>
				<Link
					to={"/my-games"}
					className={`border-b-2 transition-all duration-500 hover:border-b-white ${
						location.pathname === "/my-games"
							? "flex items-center gap-3.5 border-blue-900 p-2 font-semibold text-white"
							: "flex items-center gap-3.5 border-transparent p-2 text-zinc-500"
					}`}
				>
					<GamepadIcon
						size={20}
						color={location.pathname === "/my-games" ? "#1c398e" : "#71717b "}
					/>
					<span>Meus jogos</span>
				</Link>
				<Link
					to={"/explore"}
					className={`border-b-2 transition-all duration-500 hover:border-b-white ${
						location.pathname === "/explore"
							? "flex items-center gap-3.5 border-blue-900 p-2 font-semibold text-white"
							: "flex items-center gap-3.5 border-transparent p-2 text-zinc-500"
					}`}
				>
					<Search
						size={20}
						color={location.pathname === "/explore" ? "#1c398e" : "#71717b"}
					/>
					<span>Buscar</span>
				</Link>
			</nav>
			<div className="relative flex items-center justify-end gap-3 p-3">
				{user && (
					<>
						<img
							src={avatar}
							className="h-12 w-12 rounded-full object-contain"
						/>
						<span className="text-md text-white">
							{user?.name.trim() ? user?.name : "Não possui"}
						</span>
						<div className={`flex cursor-pointer flex-row-reverse`}>
							{!miniModalVisible ? (
								<SquareChevronDown
									className="text-white transition-all duration-500 hover:scale-110 hover:text-black"
									onClick={() => setMiniModalVisible(!miniModalVisible)}
								/>
							) : (
								<SquareChevronUp
									className="text-white transition-all duration-500 hover:scale-110 hover:text-black"
									onClick={() => setMiniModalVisible(!miniModalVisible)}
								/>
							)}
							{miniModalVisible && (
								<>
									<Link
										className="absolute top-14 right-0 flex items-center justify-center rounded bg-blue-900 p-2 text-black shadow-md transition-all duration-500 hover:bg-gray-200"
										to={"/profile"}
									>
										Minha conta
									</Link>
									<button
										onClick={() => logOut()}
										className="absolute top-26 right-0 flex cursor-pointer items-center justify-center rounded bg-red-900 p-2 text-white shadow-md transition-all duration-500 hover:bg-red-200 hover:text-black"
									>
										Sair
									</button>
								</>
							)}
						</div>
					</>
				)}
				{!user && (
					<div>
						<Link to="/login" className="flex gap-3.5 text-white">
							Login
							<SquareArrowRight className="text-white transition-all duration-500 hover:scale-110 hover:text-black" />
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
