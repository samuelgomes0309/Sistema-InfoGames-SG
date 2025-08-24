import { createBrowserRouter, type RouteObject } from "react-router";
import Home from "./pages/home";
import Explore from "./pages/explore";
import MyGames from "./pages/games";
import Login from "./pages/login";
import Profile from "./pages/profile";

const routes: RouteObject[] = [
	{
		path: "/",
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
		path: "/login",
		element: <Login />,
	},
	{
		path: "/profile",
		element: <Profile />,
	},
];

export const router = createBrowserRouter(routes);
