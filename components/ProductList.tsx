"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firestore";
import {
  Product,
  deleteProduct,
  updateProduct,
} from "@/lib/product";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const list: Product[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, "id">),
        }));

        setProducts(list);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sort) {
      case "priceHigh":
        list.sort((a, b) => b.price - a.price);
        break;

      case "priceLow":
        list.sort((a, b) => a.price - b.price);
        break;

      case "sales":
        list.sort((a, b) => b.sales - a.sales);
        break;

      default:
        list.sort((a, b) => b.createdAt - a.createdAt);
    }

    return list;
  }, [products, search, sort]);

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;

    await deleteProduct(id);
  }

  function startEdit(product: Product) {
    setEditingId(product.id!);
    setTitle(product.title);
    setPrice(product.price.toString());
    setDescription(product.description);
  }

  async function saveEdit(product: Product) {
    await updateProduct({
      ...product,
      title,
      description,
      price: Number(price),
    });

    setEditingId(null);
  }

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow">

      <div className="mb-6 flex flex-col gap-4 md:flex-row">

        <input
          placeholder="상품 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border p-3"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="new">최신순</option>
          <option value="priceHigh">가격 높은순</option>
          <option value="priceLow">가격 낮은순</option>
          <option value="sales">판매량순</option>
        </select>

      </div>

      <div className="space-y-5">

        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex gap-5 rounded-xl border p-4"
          >
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />

            <div className="flex-1">

              {editingId === product.id ? (
                <>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-2 w-full rounded border p-2"
                  />

                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mb-2 w-full rounded border p-2"
                  />

                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded border p-2"
                  />

                  <button
                    onClick={() => saveEdit(product)}
                    className="mt-3 rounded bg-green-600 px-4 py-2 text-white"
                  >
                    저장
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-blue-600 font-semibold">
                    ₩{product.price.toLocaleString()}
                  </p>

                  <p className="mt-2 text-gray-600">
                    {product.description}
                  </p>

                  <div className="mt-3 flex gap-6 text-sm text-gray-500">
                    <span>판매 {product.sales}</span>
                    <span>조회 {product.views}</span>
                    <span>찜 {product.favorites}</span>
                  </div>
                </>
              )}

            </div>

            <div className="flex flex-col gap-2">

              <button
                onClick={() => startEdit(product)}
                className="rounded bg-yellow-500 px-4 py-2 text-white"
              >
                수정
              </button>

              <button
                onClick={() => handleDelete(product.id!)}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                삭제
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}