"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function TagsPage() {
  const tags = [
    "Cute Bunny",
    "Coloring Book",
    "Printable",
    "Digital Download",
    "Kawaii",
    "Cozy",
    "Kids Activity",
    "Stress Relief",
    "Easy Coloring",
    "Bold and Easy",
    "Instant Download",
    "Animal Coloring",
    "Cute Animals",
  ];

  async function copyTags() {
    await navigator.clipboard.writeText(tags.join(", "));
    alert("태그가 복사되었습니다.");
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">
          <div className="rounded-xl bg-white p-8 shadow">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Etsy Tags</h1>

              <button
                onClick={copyTags}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                전체 복사
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="rounded-lg border bg-gray-50 p-4 text-center"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}