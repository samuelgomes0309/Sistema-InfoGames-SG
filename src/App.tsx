import { createBrowserRouter, type RouteObject } from "react-router";
import Home from "./pages/home";
import Explore from "./pages/explore";
import MyGames from "./pages/games";
import Login from "./pages/login";

const routes: RouteObject[] = [
	{
		path: "/home",
		element: <Home />,
	},
	{
		path: "/explore",
		element: <Explore />,
	},
	{
		path: "/my-games",
		element: <MyGames />,
	},
	{
		path: "/",
		element: <Login />,
	},
];

export const router = createBrowserRouter(routes);
