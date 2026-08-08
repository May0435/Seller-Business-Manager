import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      {
        error: "Etsy 인증이 취소되었거나 실패했습니다.",
        details: searchParams.get("error_description"),
      },
      { status: 400 }
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: "Etsy 인증 코드 또는 state가 없습니다." },
      { status: 400 }
    );
  }

  const savedState =
    request.cookies.get("etsy_oauth_state")?.value;

  const codeVerifier =
    request.cookies.get("etsy_code_verifier")?.value;

  if (!savedState || !codeVerifier) {
    return NextResponse.json(
      { error: "OAuth 세션 정보가 없습니다." },
      { status: 400 }
    );
  }

  if (state !== savedState) {
    return NextResponse.json(
      { error: "잘못된 OAuth state입니다." },
      { status: 400 }
    );
  }

  const clientId = process.env.ETSY_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "ETSY_CLIENT_ID가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const redirectUri =
    "https://seller-business-manager.vercel.app/api/auth/etsy/callback";

  const tokenResponse = await fetch(
    "https://api.etsy.com/v3/public/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        code_verifier: codeVerifier,
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error("Etsy token error:", tokenData);

    return NextResponse.json(
      {
        error: "Etsy 토큰 발급에 실패했습니다.",
        details: tokenData,
      },
      { status: 400 }
    );
  }

  console.log("Etsy OAuth 성공:", {
    token_type: tokenData.token_type,
    expires_in: tokenData.expires_in,
  });

  const response = NextResponse.redirect(
    new URL("/dashboard?etsy=connected", request.url)
  );

  response.cookies.delete("etsy_oauth_state");
  response.cookies.delete("etsy_code_verifier");

  return response;
}