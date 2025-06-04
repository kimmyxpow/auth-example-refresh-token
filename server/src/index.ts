import { Hono, type Context, type Next } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { decode, sign, verify } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type { JWTPayload } from "hono/utils/jwt/types";

// From .env
const ACCESS_TOKEN_SECRET = "your-access-token-secret";
const REFRESH_TOKEN_SECRET = "your-refresh-token-secret";

// From database
const users = [{ id: 1, username: "user1", password: "password123" }];
let refreshTokens: { userId: number; token: string }[] = [];

const app = new Hono();

app.use(cors({ origin: ["http://localhost:5174"], credentials: true }));

app.post("/login", async (c) => {
    const { username, password } = await c.req.json();
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user)
        return c.json({ message: "Invalid Credentials", success: false }, 401);

    const accessToken = await sign(
        {
            userId: user.id,
            exp: Math.floor(Date.now() / 1000) + 15, // 15 minutes
        },
        ACCESS_TOKEN_SECRET
    );

    const refreshToken = await sign(
        {
            userId: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
        },
        REFRESH_TOKEN_SECRET
    );

    refreshTokens.push({ token: refreshToken, userId: user.id });

    setCookie(c, "refreshToken", refreshToken, {
        secure: false, // change to true in production mode
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60,
    });

    return c.json({
        message: "Successfully login",
        success: true,
        data: { accessToken },
    });
});

app.post("/refresh-token", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");

    const storedToken = refreshTokens.find((t) => t.token === refreshToken);

    if (!refreshToken || !storedToken) {
        return c.json(
            { message: "Invalid refresh token", success: false },
            403
        );
    }

    try {
        const payload = await verify(refreshToken, REFRESH_TOKEN_SECRET);

        // Ensure userID from refresh token match with user from database
        if (payload.userId !== storedToken.userId) {
            return c.json(
                { message: "Unauthorized refresh token usage", success: false },
                403
            );
        }

        // Remove old refresh token
        refreshTokens = refreshTokens.filter((t) => t.token !== refreshToken);

        // Create new access token
        const accessToken = await sign(
            {
                userId: payload.userId,
                exp: Math.floor(Date.now() / 1000) + 15, // 15 minutes
            },
            ACCESS_TOKEN_SECRET
        );

        // Create new refresh token
        const newRefreshToken = await sign(
            {
                userId: payload.userId,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
            },
            REFRESH_TOKEN_SECRET
        );

        refreshTokens.push({ userId: payload.userId, token: newRefreshToken });

        setCookie(c, "refreshToken", newRefreshToken, {
            secure: false, // change to true in production mode
            httpOnly: true,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60,
        });

        return c.json({
            message: "Successfully receive access token",
            success: true,
            data: { accessToken },
        });
    } catch (error) {
        return c.json(
            { message: "Invalid refresh token", error, success: false },
            403
        );
    }
});

// middleware
const verifyToken = createMiddleware<{
    Variables: {
        user: JWTPayload;
    };
}>(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return c.json({ message: "Need access token", success: false }, 401);

    try {
        const payload = await verify(token, ACCESS_TOKEN_SECRET);
        c.set("user", payload);
        await next();
    } catch (error) {
        return c.json({ message: "Invalid access token", success: false }, 401);
    }
});

// protected route
app.get("/protected", verifyToken, async (c) => {
    return c.json({
        message: "This is a protected route",
        success: true,
        data: { user: c.get("user") },
    });
});

app.get("/me", verifyToken, async (c) => {
    const user = users.find((u) => u.id === c.get("user").userId);
    if (!user) {
        return c.json({ message: "User not found", success: false }, 404);
    }
    return c.json({
        message: "User found",
        success: true,
        data: { id: user.id, username: user.username },
    });
});

app.post("/logout", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");
    refreshTokens = refreshTokens.filter((t) => t.token !== refreshToken);

    deleteCookie(c, "refreshToken");

    return c.json({ message: "Successfully logged out", success: true });
});

export default app;
