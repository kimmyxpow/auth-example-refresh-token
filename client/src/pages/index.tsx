const IndexPage = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl mb-4">Home</h2>
            <p>
                This demo is built using <strong>Vite + React</strong> for the
                frontend and <strong>Hono</strong> for the backend. For the API
                client, it uses <strong>Alova</strong>, which also simplifies
                authentication.
            </p>
            <p>
                This is just a basic implementation, so it can be adapted to
                other tech stacks as well. You can try logging in with the
                username: <strong>user1</strong> and password:{" "}
                <strong>password123</strong>. Feature 👇🏻:
            </p>
            <ul className="list-disc list-inside">
                <li>
                    <strong>Short-lived access token:</strong> The access token
                    expires quickly (e.g., in a few minutes) to reduce the risk
                    of misuse if leaked.
                </li>
                <li>
                    <strong>HTTP-only refresh token:</strong> Stored securely in
                    an HTTP-only cookie, making it inaccessible to JavaScript
                    and reducing XSS attack risks.
                </li>
                <li>
                    <strong>Auto refresh:</strong> When the access token
                    expires, the client automatically uses the refresh token to
                    get a new one without user interaction.
                </li>
                <li>
                    <strong>Refresh token rotation:</strong> Every time a new
                    access token is issued using the refresh token, a new
                    refresh token is also generated and sent, invalidating the
                    previous one. This helps prevent token reuse in case of
                    leaks.
                </li>
            </ul>
        </div>
    );
};

export default IndexPage;
