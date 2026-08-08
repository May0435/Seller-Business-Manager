"use client";

import { logout } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/files": "Files",
  "/tags": "Tags",
  "/settings": "Settings",
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {titles[pathname] ?? "Etsy Manager Pro"}
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
          🔔
        </button>

        <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
          ⚙️
        </button>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}