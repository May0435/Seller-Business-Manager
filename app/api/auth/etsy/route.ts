import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

function base64Url(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.ETSY_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json(
        { error: "ETSY_CLIENT_ID가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 현재 로그인한 Firebase 사용자 확인
    const sessionCookie = request.cookies.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "로그인 세션이 없습니다." },
        { status: 401 }
      );
    }

    const adminAuth = getAuth();

    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );

    const uid = decodedToken.uid;

    const state = base64Url(crypto.randomBytes(32));
    const codeVerifier = base64Url(crypto.randomBytes(32));

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

    // OAuth 요청과 Firebase 사용자를 연결
    response.cookies.set("etsy_firebase_uid", uid, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Etsy OAuth start error:", error);

    return NextResponse.json(
      {
        error: "Etsy 인증을 시작할 수 없습니다.",
      },
      { status: 500 }
    );
  }
}