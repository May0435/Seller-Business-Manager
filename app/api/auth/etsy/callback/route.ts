import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
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

    const savedState = request.cookies.get("etsy_oauth_state")?.value;
    const codeVerifier =
      request.cookies.get("etsy_code_verifier")?.value;
    const firebaseUid =
      request.cookies.get("etsy_firebase_uid")?.value;

    if (!savedState || !codeVerifier || !firebaseUid) {
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

    // Firebase UID가 실제 사용자로 존재하는지 확인
    const adminAuth = getAuth();

    await adminAuth.getUser(firebaseUid);

    const clientId = process.env.ETSY_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json(
        { error: "ETSY_CLIENT_ID가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const redirectUri =
      "https://seller-business-manager.vercel.app/api/auth/etsy/callback";

    // Etsy authorization code → OAuth token
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

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Etsy 토큰 응답이 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // Firestore에 Etsy 연결 정보 저장
    const db = getFirestore();

    await db
      .collection("users")
      .doc(firebaseUid)
      .collection("integrations")
      .doc("etsy")
      .set({
        provider: "etsy",
        accessToken,
        refreshToken,
        expiresAt: Date.now() + Number(expiresIn || 3600) * 1000,
        connectedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

    const response = NextResponse.redirect(
      new URL("/dashboard?etsy=connected", request.url)
    );

    // OAuth 임시 쿠키 삭제
    response.cookies.delete("etsy_oauth_state");
    response.cookies.delete("etsy_code_verifier");
    response.cookies.delete("etsy_firebase_uid");

    return response;
  } catch (error) {
    console.error("Etsy callback error:", error);

    return NextResponse.json(
      {
        error: "Etsy 연결 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}