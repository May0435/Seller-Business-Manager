"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function createServerSession() {
    const user = await signIn(email, password);

    const idToken = await user.user.getIdToken();

    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
      }),
    });

    if (!response.ok) {
      throw new Error("서버 로그인 세션을 만들지 못했습니다.");
    }
  }

  async function handleSignUp() {
    try {
      setLoading(true);

      await signUp(email, password);

      alert("회원가입 완료!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    try {
      setLoading(true);

      await createServerSession();

      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-bold">
        Etsy Manager Pro
      </h1>

      <p className="mb-8 text-center text-gray-500">
        로그인
      </p>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-lg border p-3"
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 w-full rounded-lg border p-3"
      />

      <div className="flex gap-3">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex-1 rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "처리 중..." : "로그인"}
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="flex-1 rounded-lg bg-green-600 py-3 text-white hover:bg-green-700 disabled:opacity-50"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}