import { NextResponse } from "next/server";
import crypto from "crypto";

function base64Url(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function GET() {
  const clientId = process.env.ETSY_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "ETSY_CLIENT_ID가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const state = base64Url(crypto.randomBytes(32));

  const codeVerifier = base64Url(
    crypto.randomBytes(32)
  );

  const codeChallenge = base64Url(
    crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest()
  );

  const redirectUri =
    "https://seller-business-manager.vercel.app/api/auth/etsy/callback";

  const scopes = [
    "shops_r",
    "listings_r",
    "transactions_r",
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const response = NextResponse.redirect(
    `https://www.etsy.com/oauth/connect?${params.toString()}`
  );

  response.cookies.set("etsy_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  response.cookies.set("etsy_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}