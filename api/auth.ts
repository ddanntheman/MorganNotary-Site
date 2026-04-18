/**
 * GitHub OAuth — start. Part of the Sveltia CMS auth proxy.
 *
 * Flow: Sveltia CMS opens a popup to `/api/auth?provider=github&scope=repo,user`,
 * this function generates a CSRF state, stashes it in an HttpOnly cookie,
 * and redirects the popup to GitHub's authorize endpoint. GitHub then sends
 * the user back to /api/callback, which completes the handshake.
 *
 * Deployed as a Vercel Edge function — no dependencies beyond the Web APIs.
 * Env vars expected (set in the Vercel project dashboard):
 *   - GITHUB_CLIENT_ID       (public, from the GitHub OAuth App)
 *   - GITHUB_CLIENT_SECRET   (secret, from the GitHub OAuth App)
 * Optional:
 *   - OAUTH_ALLOWED_ORIGIN   (defaults to the request origin)
 */

export const config = { runtime: "edge" };

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const STATE_COOKIE = "sveltia_oauth_state";
const STATE_COOKIE_MAX_AGE = 600; // 10 minutes

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") ?? "github";
  const scope = url.searchParams.get("scope") ?? "repo,user";

  if (provider !== "github") {
    return new Response(`Unsupported provider: ${provider}`, { status: 400 });
  }

  const clientId = getEnv("GITHUB_CLIENT_ID");
  if (!clientId) {
    return new Response(
      "Missing GITHUB_CLIENT_ID env var. Set it in the Vercel project settings.",
      { status: 500 },
    );
  }

  // CSRF-protect the round-trip with a random state.
  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/api/callback`;

  const authorize = new URL(GITHUB_AUTHORIZE_URL);
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", scope);
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("allow_signup", "true");

  const headers = new Headers({ Location: authorize.toString() });
  headers.append(
    "Set-Cookie",
    `${STATE_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${STATE_COOKIE_MAX_AGE}`,
  );

  return new Response(null, { status: 302, headers });
}

function getEnv(name: string): string | undefined {
  const env = (globalThis as unknown as { process?: { env: Record<string, string | undefined> } })
    .process?.env;
  return env?.[name];
}
