import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./App";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/authContexts";

createRoot(document.getElementById("root")!).render(
	<>
		<AuthProvider>
			<RouterProvider router={router} />
			<ToastContainer />
		</AuthProvider>
	</>
);
