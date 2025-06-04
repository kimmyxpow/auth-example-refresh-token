import { protectedApi } from "@/lib/api";
import { useEffect, useState } from "react";

const ProtectedPage = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await protectedApi();
                setMessage(response.message);
                setError("");
            } catch (err) {
                setError(
                    (err as Error).message || "Failed to access protected route"
                );
                setMessage("");
            }
        };
        fetchProtectedData();
    }, []);

    return (
        <div>
            <h1 className="text-2xl mb-4">Protected Page</h1>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
};

export default ProtectedPage;
