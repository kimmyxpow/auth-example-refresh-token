import { loginApi } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useRevalidator } from "react-router";

const LoginPage = () => {
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const [data, setData] = useState({
        username: "user1",
        password: "password123",
    });

    const handleLogin = async () => {
        const response = await loginApi(data);

        if (!response.success) return toast.error(response.message);

        revalidator.revalidate();
        navigate("/protected");
    };

    return (
        <div className="grid gap-2">
            <input
                type="text"
                placeholder="Username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className="h-12 px-6 focus:ring-indigo-200 transition-all ring-2 ring-transparent border border-zinc-300 focus:outline-none"
            />
            <input
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="h-12 px-6 focus:ring-indigo-200 transition-all ring-2 ring-transparent border border-zinc-300 focus:outline-none"
            />
            <button
                onClick={handleLogin}
                className="h-12 px-6 bg-zinc-800 text-white"
            >
                Login
            </button>
        </div>
    );
};

export default LoginPage;
