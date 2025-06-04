import { logoutApi } from "@/lib/api";
import {
    Link,
    Outlet,
    useLoaderData,
    useNavigate,
    useRevalidator,
} from "react-router";
import { toast, Toaster } from "sonner";

const RootLayout = () => {
    const { session } = useLoaderData();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const handleLogout = async () => {
        const response = await logoutApi();

        if (!response.success) return toast.error(response.message);

        revalidator.revalidate();
        navigate("/login");
    };

    return (
        <div className="max-w-lg mx-auto py-12 space-y-4">
            <h1 className="text-4xl">
                Basic Example Refresh Token + Auth Token
            </h1>
            <nav className="flex gap-4 items-center">
                <Link className="hover:underline" to="/">
                    Home
                </Link>
                {session && session.success ? (
                    <>
                        <Link className="hover:underline" to="/protected">
                            Protected
                        </Link>
                        <button
                            className="hover:underline"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        <span className="text-sm h-8 px-4 flex items-center bg-zinc-800 text-white">
                            Logged in as {session.data.username}
                        </span>
                    </>
                ) : (
                    <Link className="hover:underline" to="/login">
                        Login
                    </Link>
                )}
            </nav>
            <Outlet />
            <Toaster position="top-center" closeButton richColors />
        </div>
    );
};

export default RootLayout;
