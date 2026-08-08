"use client";

import { useState } from "react";
import { addProduct } from "@/lib/product";
import { uploadImage } from "@/lib/cloudinary";

export default function ProductForm() {
  const [sku, setSku] = useState("");
  const [title, setTitle] = useState("");
  const [etsyUrl, setEtsyUrl] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [season, setSeason] = useState("Other");
  const [tags, setTags] = useState("");
  const [sales, setSales] = useState("0");
  const [revenue, setRevenue] = useState("0");
  const [views, setViews] = useState("0");
  const [favorites, setFavorites] = useState("0");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [memo, setMemo] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) {
      alert("상품명을 입력하세요.");
      return;
    }

    if (!price) {
      alert("가격을 입력하세요.");
      return;
    }

    if (!image) {
      alert("이미지를 선택하세요.");
      return;
    }

    try {
      setLoading(true);

      // 이미지 업로드
      const imageUrl = await uploadImage(image);

      // 태그를 쉼표 기준으로 배열로 변환
      const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const now = Date.now();

      await addProduct({
        sku: sku.trim() || `SKU-${now}`,

        title: title.trim(),

        description: description.trim(),

        price: Number(price),

        imageUrl,

        etsyUrl: etsyUrl.trim(),

        sales: Number(sales) || 0,

        revenue: Number(revenue) || 0,

        views: Number(views) || 0,

        favorites: Number(favorites) || 0,

        status,

        season,

        tags: tagList,

        memo: memo.trim(),

        createdAt: now,

        updatedAt: now,
      });

      alert("상품이 등록되었습니다.");

      // 입력값 초기화
      setSku("");
      setTitle("");
      setEtsyUrl("");
      setPrice("");
      setDescription("");
      setSeason("Other");
      setTags("");
      setSales("0");
      setRevenue("0");
      setViews("0");
      setFavorites("0");
      setStatus("draft");
      setMemo("");
      setImage(null);
    } catch (error) {
      console.error("상품 등록 오류:", error);
      alert("상품 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">상품 등록</h2>

      {/* SKU */}
      <label className="mb-2 block text-sm font-medium">
        SKU
      </label>

      <input
        className="mb-4 w-full rounded-lg border p-3"
        placeholder="비워두면 자동 생성"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />

      {/* 상품명 */}
      <label className="mb-2 block text-sm font-medium">
        상품명 *
      </label>

      <input
        className="mb-4 w-full rounded-lg border p-3"
        placeholder="예: Cozy Halloween Coloring Book"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Etsy URL */}
      <label className="mb-2 block text-sm font-medium">
        Etsy 상품 URL
      </label>

      <input
        className="mb-4 w-full rounded-lg border p-3"
        type="url"
        placeholder="https://www.etsy.com/listing/..."
        value={etsyUrl}
        onChange={(e) => setEtsyUrl(e.target.value)}
      />

      {/* 가격 */}
      <label className="mb-2 block text-sm font-medium">
        가격 *
      </label>

      <input
        className="mb-4 w-full rounded-lg border p-3"
        type="number"
        min="0"
        step="0.01"
        placeholder="예: 4.99"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* 설명 */}
      <label className="mb-2 block text-sm font-medium">
        상품 설명
      </label>

      <textarea
        className="mb-4 w-full rounded-lg border p-3"
        rows={5}
        placeholder="상품 설명을 입력하세요."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* 시즌 */}
      <label className="mb-2 block text-sm font-medium">
        시즌
      </label>

      <select
        className="mb-4 w-full rounded-lg border p-3"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
      >
        <option value="Other">Other</option>
        <option value="Spring">Spring</option>
        <option value="Summer">Summer</option>
        <option value="Fall">Fall</option>
        <option value="Winter">Winter</option>
        <option value="Valentine">Valentine</option>
        <option value="Easter">Easter</option>
        <option value="Halloween">Halloween</option>
        <option value="Christmas">Christmas</option>
      </select>

      {/* 태그 */}
      <label className="mb-2 block text-sm font-medium">
        태그
      </label>

      <input
        className="mb-1 w-full rounded-lg border p-3"
        placeholder="coloring book, halloween, cute, cozy"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <p className="mb-4 text-xs text-gray-500">
        태그는 쉼표(,)로 구분하세요.
      </p>

      {/* 판매 데이터 */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            판매량
          </label>

          <input
            className="w-full rounded-lg border p-3"
            type="number"
            min="0"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            매출
          </label>

          <input
            className="w-full rounded-lg border p-3"
            type="number"
            min="0"
            step="0.01"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            조회수
          </label>

          <input
            className="w-full rounded-lg border p-3"
            type="number"
            min="0"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            찜
          </label>

          <input
            className="w-full rounded-lg border p-3"
            type="number"
            min="0"
            value={favorites}
            onChange={(e) => setFavorites(e.target.value)}
          />
        </div>
      </div>

      {/* 상태 */}
      <label className="mb-2 block text-sm font-medium">
        상태
      </label>

      <select
        className="mb-4 w-full rounded-lg border p-3"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as "draft" | "published")
        }
      >
        <option value="draft">초안</option>
        <option value="published">판매중</option>
      </select>

      {/* 메모 */}
      <label className="mb-2 block text-sm font-medium">
        메모
      </label>

      <textarea
        className="mb-4 w-full rounded-lg border p-3"
        rows={4}
        placeholder="상품 관련 메모"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      />

      {/* 이미지 */}
      <label className="mb-2 block text-sm font-medium">
        상품 이미지 *
      </label>

      <input
        className="mb-6 block"
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setImage(e.target.files[0]);
          }
        }}
      />

      {/* 등록 */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "업로드 중..." : "상품 등록"}
      </button>
    </div>
  );
}