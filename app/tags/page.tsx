"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { db } from "@/lib/firestore";
import { Product } from "@/lib/product";

interface TagInfo {
  name: string;
  count: number;
}

export default function TagsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const list: Product[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, "id">),
        }));

        setProducts(list);
      },
      (error) => {
        console.error(
          "상품 데이터를 불러오지 못했습니다.",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  const tagList = useMemo<TagInfo[]>(() => {
    const tagMap = new Map<string, number>();

    products.forEach((product) => {
      product.tags?.forEach((tag) => {
        const cleanedTag = tag.trim();

        if (!cleanedTag) return;

        const key = cleanedTag.toLowerCase();

        tagMap.set(
          key,
          (tagMap.get(key) ?? 0) + 1
        );
      });
    });

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const filteredTags = useMemo(() => {
    if (!search.trim()) {
      return tagList;
    }

    const keyword = search.toLowerCase();

    return tagList.filter((tag) =>
      tag.name.toLowerCase().includes(keyword)
    );
  }, [tagList, search]);

  async function copyTag(tag: string) {
    await navigator.clipboard.writeText(tag);

    alert(`"${tag}" 태그가 복사되었습니다.`);
  }

  async function copyAllTags() {
    if (tagList.length === 0) {
      alert("복사할 태그가 없습니다.");
      return;
    }

    await navigator.clipboard.writeText(
      tagList.map((tag) => tag.name).join(", ")
    );

    alert("전체 태그가 복사되었습니다.");
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">
          <div className="rounded-xl bg-white p-8 shadow-sm">

            {/* 제목 */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Etsy Tags
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  상품에 입력된 태그를 자동으로 모아 관리합니다.
                </p>
              </div>

              <button
                onClick={copyAllTags}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                전체 복사
              </button>
            </div>

            {/* 검색 */}
            <input
              type="text"
              placeholder="태그 검색..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="mb-6 w-full rounded-lg border p-3"
            />

            {/* 통계 */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  전체 태그
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {tagList.length}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  등록 상품
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {products.length}
                </p>
              </div>
            </div>

            {/* 태그 목록 */}
            {filteredTags.length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center text-gray-400">
                {products.length === 0
                  ? "등록된 상품이 없습니다."
                  : "해당하는 태그가 없습니다."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredTags.map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {tag.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {tag.count}개 상품
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        copyTag(tag.name)
                      }
                      className="ml-3 shrink-0 rounded-md bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
                    >
                      복사
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}