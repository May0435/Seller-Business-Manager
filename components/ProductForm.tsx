"use client";

import { useState } from "react";
import { addProduct } from "@/lib/product";
import { uploadImage } from "@/lib/cloudinary";

export default function ProductForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!image) {
      alert("이미지를 선택하세요.");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImage(image);

      await addProduct({
        sku: `SKU-${Date.now()}`,

        title,
        description,
        price: Number(price),

        imageUrl,

        etsyUrl: "",

        sales: 0,
        revenue: 0,
        views: 0,
        favorites: 0,

        status: "draft",

        season: "Other",

        tags: [],

        memo: "",

        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      alert("상품이 등록되었습니다.");

      setTitle("");
      setPrice("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("등록 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        상품 등록
      </h2>

      <input
        className="mb-3 w-full rounded border p-3"
        placeholder="상품명"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="mb-3 w-full rounded border p-3"
        type="number"
        placeholder="가격"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <textarea
        className="mb-3 w-full rounded border p-3"
        rows={4}
        placeholder="설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="mb-5"
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setImage(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "업로드 중..." : "상품 등록"}
      </button>
    </div>
  );
}