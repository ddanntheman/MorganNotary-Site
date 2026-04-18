/**
 * GitHub OAuth — callback. Part of the Sveltia CMS auth proxy.
 *
 * Receives the OAuth code from GitHub, validates the CSRF state, exchanges
 * the code for an access token, and posts the token back to the opening
 * window (the /admin page running Sveltia CMS) via window.postMessage —
 * which is the handshake format both Decap CMS and Sveltia CMS listen for.
 *
 * Deployed as a Vercel Edge function. Env vars expected:
 *   - GITHUB_CLIENT_ID
 *   - GITHUB_CLIENT_SECRET
 */

export const config = { runtime: "edge" };

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const STATE_COOKIE = "sveltia_oauth_state";

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return htmlResponse(renderError(`GitHub returned an error: ${error}`));
  }
  if (!code) {
    return htmlResponse(renderError("Missing ?code in callback URL."));
  }

  const cookieState = readCookie(request.headers.get("cookie"), STATE_COOKIE);
  if (!cookieState || cookieState !== state) {
    return htmlResponse(
      renderError(
        "OAuth state mismatch. Try logging in again — if this keeps happening, clear cookies and retry.",
      ),
    );
  }

  const clientId = getEnv("GITHUB_CLIENT_ID");
  const clientSecret = getEnv("GITHUB_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    return htmlResponse(
      renderError(
        "Server misconfigured: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET env var is missing. Set both in the Vercel project settings and redeploy.",
      ),
    );
  }

  let accessToken: string;
  try {
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const body = await tokenResponse.text();
      return htmlResponse(
        renderError(`GitHub token exchange failed (${tokenResponse.status}): ${body}`),
      );
    }

    const payload = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (payload.error || !payload.access_token) {
      return htmlResponse(
        renderError(
          `GitHub token exchange rejected: ${payload.error_description ?? payload.error ?? "no access_token in response"}`,
        ),
      );
    }
    accessToken = payload.access_token;
  } catch (err) {
    return htmlResponse(renderError(`Network error talking to GitHub: ${(err as Error).message}`));
  }

  // Clear the state cookie now that we've used it.
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });
  headers.append(
    "Set-Cookie",
    `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  );

  return new Response(renderSuccess(accessToken), { status: 200, headers });
}

/**
 * Render the success page. Decap CMS and Sveltia CMS both listen for a
 * specific handshake on the opener window:
 *   1. popup sends `authorizing:github`
 *   2. opener replies with its origin to confirm it's listening
 *   3. popup sends `authorization:github:success:{<json>}` with the token
 *   4. popup closes itself
 */
function renderSuccess(token: string): string {
  const payload = JSON.stringify({ token, provider: "github" });
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Signing you in…</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 2rem; color: #1e3a5f; }
      .msg { max-width: 480px; }
    </style>
  </head>
  <body>
    <div class="msg">
      <h1>Signed in ✓</h1>
      <p>You can close this window. If it doesn't close automatically, the CMS is already authenticated in the background.</p>
    </div>
    <script>
      (function () {
        var payload = ${JSON.stringify(payload)};
        var opener = window.opener;
        if (!opener) {
          document.body.innerHTML = "<p>This page should have been opened from the CMS login flow. Close this tab and try again.</p>";
          return;
        }
        function send(origin) {
          opener.postMessage("authorization:github:success:" + payload, origin);
        }
        // Two-phase handshake with the CMS. Respond with the token to the
        // same origin the CMS advertises — we don't broadcast to "*".
        function onMessage(e) {
          if (typeof e.data !== "string") return;
          if (e.data === "authorizing:github") {
            // CMS confirmed it's listening; send the token back.
            send(e.origin);
            window.removeEventListener("message", onMessage);
            setTimeout(function () { window.close(); }, 300);
          }
        }
        window.addEventListener("message", onMessage, false);
        // Nudge the opener to start listening.
        opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;
}

function renderError(message: string): string {
  const safe = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sign-in error</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 2rem; color: #1e3a5f; }
      pre { background: #eef3fa; padding: 1rem; border-radius: 8px; white-space: pre-wrap; word-break: break-word; }
    </style>
  </head>
  <body>
    <h1>Couldn't sign you in.</h1>
    <pre>${safe}</pre>
    <p><a href="/admin/">← Back to the CMS</a></p>
  </body>
</html>`;
}

function htmlResponse(body: string, status = 400): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

function getEnv(name: string): string | undefined {
  const env = (globalThis as unknown as { process?: { env: Record<string, string | undefined> } })
    .process?.env;
  return env?.[name];
}
