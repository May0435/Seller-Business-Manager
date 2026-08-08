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
      }
    );

    return () => unsubscribe();
  }, []);

  const totalProducts = products.length;

  const totalSales = products.reduce(
    (sum, p) => sum + (p.sales ?? 0),
    0
  );

  const totalRevenue = products.reduce(
    (sum, p) => sum + (p.revenue ?? 0),
    0
  );

  const draftCount = products.filter(
    (p) => p.status === "draft"
  ).length;

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">총 상품</p>
            <h2 className="mt-4 text-4xl font-bold">
              {totalProducts}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">총 판매량</p>
            <h2 className="mt-4 text-4xl font-bold">
              {totalSales}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">총 매출</p>
            <h2 className="mt-4 text-4xl font-bold">
              ${totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">초안 상품</p>
            <h2 className="mt-4 text-4xl font-bold">
              {draftCount}
            </h2>
          </div>

        </div>

        <div className="px-8 pb-8">

          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-5 text-2xl font-bold">
              최근 등록 상품
            </h2>

            {products.length === 0 ? (
              <p className="text-gray-400">
                등록된 상품이 없습니다.
              </p>
            ) : (
              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="py-3 text-left">
                      상품명
                    </th>

                    <th className="py-3 text-left">
                      가격
                    </th>

                    <th className="py-3 text-left">
                      상태
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((product) => (
                      <tr
                        key={product.id}
                        className="border-b"
                      >
                        <td className="py-4">
                          {product.title}
                        </td>

                        <td>
                          ₩
                          {product.price.toLocaleString()}
                        </td>

                        <td>
                          {product.status}
                        </td>
                      </tr>
                    ))}

                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}