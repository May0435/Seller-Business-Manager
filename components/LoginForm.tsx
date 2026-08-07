"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    try {
      await signUp(email, password);
      alert("회원가입이 완료되었습니다!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-3xl font-bold">
        Etsy Manager Pro
      </h1>

      <p className="mb-8 text-center text-gray-500">
        Digital Product Manager
      </p>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSignUp}
        className="w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700"
      >
        회원가입
      </button>
    </div>
  );
}