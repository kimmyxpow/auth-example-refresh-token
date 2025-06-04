import { createAlova, RequestBody } from "alova";
import adapterFetch from "alova/fetch";
import { createServerTokenAuthentication } from "alova/client";
import { ApiResponse } from "shared";
import reactHook from "alova/react";

let accessToken = "";

const setAccessToken = (token: string) => {
    accessToken = token;
};

const { onAuthRequired, onResponseRefreshToken } =
    createServerTokenAuthentication({
        refreshTokenOnSuccess: {
            isExpired: (response) => {
                return response.status === 401;
            },

            handler: async () => {
                const response = await refreshTokenApi();

                if (!response.success) location.href = "/login";

                setAccessToken(response.data.accessToken);
            },
        },
        async login(response) {
            const json = await response.clone().json();
            setAccessToken(json.data.accessToken);
        },
        logout() {
            //
        },
    });

export const alovaInstance = createAlova({
    requestAdapter: adapterFetch(),
    baseURL: "http://localhost:3000",
    statesHook: reactHook,
    beforeRequest: onAuthRequired((method) => {
        method.config.credentials = "include";
        method.config.headers.Authorization = `Bearer ${accessToken}`;
    }),
    responded: onResponseRefreshToken((response) => {
        return response.json();
    }),
});

// API
export const refreshTokenApi = () => {
    const method =
        alovaInstance.Post<ApiResponse<{ accessToken: string }>>(
            "/refresh-token"
        );
    method.meta = {
        authRole: "refreshToken",
    };
    return method;
};

export const loginApi = (body: RequestBody) => {
    const method = alovaInstance.Post<ApiResponse<{ accessToken: string }>>(
        "/login",
        body
    );
    method.meta = {
        authRole: "login",
    };
    return method;
};

export const logoutApi = () => {
    const method = alovaInstance.Post<ApiResponse>("/logout");
    method.meta = {
        authRole: "logout",
    };
    return method;
};

export const sessionApi = async () => {
    const refreshToken = await refreshTokenApi();
    if (!refreshToken.success) return null;
    setAccessToken(refreshToken.data.accessToken);
    const method = alovaInstance.Get("/me", {
        credentials: "include",
        headers: {
            Authorization: "Bearer " + refreshToken.data.accessToken,
        },
    });
    return method;
};

export const protectedApi = () => {
    const method = alovaInstance.Get<ApiResponse>("/protected");
    return method;
};
