import { protectedApi } from "@/lib/api";
import { useWatcher } from "alova/client";
import { useLocation } from "react-router";

const ProtectedPage = () => {
    const location = useLocation();

    const { loading, data } = useWatcher(
        () => protectedApi(),
        [location.pathname],
        { immediate: true }
    );

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-2xl mb-4">Protected Page</h1>
            <p className="text-emerald-600">{data.message}</p>
        </div>
    );
};

export default ProtectedPage;
