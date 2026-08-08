"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    title: "Products",
    href: "/products",
    icon: "📦",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "📈",
  },
  {
    title: "Files",
    href: "/files",
    icon: "📁",
  },
  {
    title: "Tags",
    href: "/tags",
    icon: "🏷️",
  },
  {
    title: "Planner",
    href: "/planner",
    icon: "📅",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "⚙️",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-gray-200 bg-white shadow-sm">
      <div className="border-b p-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Etsy Manager
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Business Dashboard
        </p>
      </div>

      <nav className="flex-1 p-5">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition ${
              pathname === menu.href
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-2xl">{menu.icon}</span>
            {menu.title}
          </Link>
        ))}
      </nav>

      <div className="border-t p-6">
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-gray-500">
            Current Version
          </p>

          <p className="mt-1 text-xl font-bold text-blue-600">
            v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}