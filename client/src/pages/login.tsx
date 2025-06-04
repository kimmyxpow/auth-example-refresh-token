import { loginApi } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const LoginPage = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const handleLogin = async () => {
        const response = await loginApi(data);

        if (!response.success) return toast.error(response.message);

        navigate("/protected");
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="Username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className="h-12 px-6 rounded-xl focus:ring-indigo-200 transition-all ring-2 ring-transparent border border-zinc-300 focus:outline-none"
            />
            <input
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="h-12 px-6 rounded-xl focus:ring-indigo-200 transition-all ring-2 ring-transparent border border-zinc-300 focus:outline-none"
            />
            <button
                onClick={handleLogin}
                className="h-12 px-6 rounded-xl bg-indigo-600 text-white"
            >
                Login
            </button>
        </div>
    );
};

export default LoginPage;
