"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      await signIn(email, password);
      router.push("/dashboard");
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

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-3xl font-bold">
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
          className="flex-1 rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          로그인
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="flex-1 rounded-lg bg-green-600 py-3 text-white hover:bg-green-700"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}