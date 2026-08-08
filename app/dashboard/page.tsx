"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firestore";
import { Product } from "@/lib/product";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
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

  const totalProducts = products.length;

  const publishedCount = products.filter(
    (p) => p.status === "published"
  ).length;

  const draftCount = products.filter(
    (p) => p.status === "draft"
  ).length;

  const totalSales = products.reduce(
    (sum, p) => sum + (p.sales ?? 0),
    0
  );

  const totalRevenue = products.reduce(
    (sum, p) => sum + (p.revenue ?? 0),
    0
  );

  const totalViews = products.reduce(
    (sum, p) => sum + (p.views ?? 0),
    0
  );

  const totalFavorites = products.reduce(
    (sum, p) => sum + (p.favorites ?? 0),
    0
  );

  const recentProducts = [...products]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">
          {/* 제목 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Etsy 상품과 판매 데이터를 한눈에 확인하세요.
            </p>
          </div>

          {/* 주요 통계 */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 전체 상품 */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                전체 상품
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {totalProducts}
              </h2>
            </div>

            {/* 판매중 상품 */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                판매중 상품
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {publishedCount}
              </h2>
            </div>

            {/* 초안 상품 */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                초안 상품
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {draftCount}
              </h2>
            </div>

            {/* 총 판매량 */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                총 판매량
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {totalSales.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* 추가 통계 */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* 총 매출 */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                총 매출
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                ${totalRevenue.toLocaleString()}
              </h2>
            </div>

            {/* 총 조회수 */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                총 조회수
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {totalViews.toLocaleString()}
              </h2>
            </div>

            {/* 총 찜 */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                총 찜
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {totalFavorites.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* 최근 상품 */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold">
                최근 등록 상품
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                최근 등록된 상품 5개입니다.
              </p>
            </div>

            {recentProducts.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                등록된 상품이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-150">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="px-3 py-3">
                        상품명
                      </th>

                      <th className="px-3 py-3">
                        가격
                      </th>

                      <th className="px-3 py-3">
                        판매
                      </th>

                      <th className="px-3 py-3">
                        조회
                      </th>

                      <th className="px-3 py-3">
                        상태
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-3 py-4 font-medium">
                          {product.title}
                        </td>

                        <td className="px-3 py-4">
                          ${product.price.toLocaleString()}
                        </td>

                        <td className="px-3 py-4">
                          {product.sales.toLocaleString()}
                        </td>

                        <td className="px-3 py-4">
                          {product.views.toLocaleString()}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={
                              product.status === "published"
                                ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                            }
                          >
                            {product.status === "published"
                              ? "판매중"
                              : "초안"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}