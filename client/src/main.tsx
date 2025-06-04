import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import IndexPage from "./pages";
import LoginPage from "./pages/login";
import ProtectedPage from "./pages/protected";
import RootLayout from "./layouts/root-layout";
import { sessionApi } from "./lib/api";

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        loader: async () => {
            return { session: await sessionApi() };
        },
        children: [
            { index: true, Component: IndexPage },
            { path: "login", Component: LoginPage },
            { path: "protected", Component: ProtectedPage },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
