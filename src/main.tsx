import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./App";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
	<>
		<RouterProvider router={router} />
		<ToastContainer />
	</>
);
