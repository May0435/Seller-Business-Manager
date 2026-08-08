"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { db } from "@/lib/firestore";
import {
  addPlan,
  deletePlan,
  updatePlan,
  Plan,
} from "@/lib/plan";

export default function PlannerPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  const [season, setSeason] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] =
    useState<Plan["status"]>("준비중");
  const [memo, setMemo] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "plans"),
      (snapshot) => {
        const list: Plan[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Plan, "id">),
        }));

        setPlans(list);
      },
      (error) => {
        console.error(
          "일정을 불러오지 못했습니다.",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  function resetForm() {
    setSeason("");
    setDate("");
    setStatus("준비중");
    setMemo("");
    setEditingId(null);
  }

  async function handleSubmit() {
    if (!season.trim()) {
      alert("시즌을 입력하세요.");
      return;
    }

    if (!date) {
      alert("출시일을 선택하세요.");
      return;
    }

    try {
      setLoading(true);

      const now = Date.now();

      if (editingId) {
        await updatePlan({
          id: editingId,
          season: season.trim(),
          date,
          status,
          memo: memo.trim(),
          createdAt:
            plans.find((p) => p.id === editingId)
              ?.createdAt ?? now,
          updatedAt: now,
        });

        alert("일정이 수정되었습니다.");
      } else {
        await addPlan({
          season: season.trim(),
          date,
          status,
          memo: memo.trim(),
          createdAt: now,
          updatedAt: now,
        });

        alert("일정이 등록되었습니다.");
      }

      resetForm();
    } catch (error) {
      console.error("일정 저장 오류:", error);

      alert(
        error instanceof Error
          ? error.message
          : "일정 저장에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEdit(plan: Plan) {
    setEditingId(plan.id ?? null);
    setSeason(plan.season);
    setDate(plan.date);
    setStatus(plan.status);
    setMemo(plan.memo);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 일정을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deletePlan(id);
      alert("일정이 삭제되었습니다.");

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("일정 삭제 오류:", error);

      alert(
        error instanceof Error
          ? error.message
          : "일정 삭제에 실패했습니다."
      );
    }
  }

  function getStatusClass(status: Plan["status"]) {
    switch (status) {
      case "완료":
        return "bg-green-100 text-green-700";

      case "업로드 예정":
        return "bg-blue-100 text-blue-700";

      case "제작중":
        return "bg-purple-100 text-purple-700";

      case "검토":
        return "bg-orange-100 text-orange-700";

      case "준비중":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  const sortedPlans = [...plans].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">

          {/* 제목 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Release Planner
            </h1>

            <p className="mt-2 text-gray-500">
              Etsy 상품의 제작과 출시 일정을 관리하세요.
            </p>
          </div>

          {/* 일정 등록 */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              {editingId
                ? "일정 수정"
                : "새 일정 등록"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              {/* 시즌 */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  시즌
                </label>

                <input
                  value={season}
                  onChange={(e) =>
                    setSeason(e.target.value)
                  }
                  placeholder="예: 🎃 Halloween"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* 출시일 */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  출시일
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* 상태 */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  상태
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as Plan["status"]
                    )
                  }
                  className="w-full rounded-lg border p-3"
                >
                  <option value="준비중">
                    준비중
                  </option>

                  <option value="제작중">
                    제작중
                  </option>

                  <option value="검토">
                    검토
                  </option>

                  <option value="업로드 예정">
                    업로드 예정
                  </option>

                  <option value="완료">
                    완료
                  </option>

                  <option value="대기">
                    대기
                  </option>
                </select>
              </div>

              {/* 메모 */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  메모
                </label>

                <input
                  value={memo}
                  onChange={(e) =>
                    setMemo(e.target.value)
                  }
                  placeholder="예: 표지 제작 완료"
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading
                  ? "저장 중..."
                  : editingId
                    ? "수정 저장"
                    : "일정 등록"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="rounded-lg border px-6 py-3 hover:bg-gray-50"
                >
                  취소
                </button>
              )}
            </div>
          </div>

          {/* 일정 목록 */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              출시 일정
            </h2>

            {sortedPlans.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                등록된 일정이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-175">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="px-3 py-3">
                        시즌
                      </th>

                      <th className="px-3 py-3">
                        출시일
                      </th>

                      <th className="px-3 py-3">
                        상태
                      </th>

                      <th className="px-3 py-3">
                        메모
                      </th>

                      <th className="px-3 py-3">
                        관리
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedPlans.map((plan) => (
                      <tr
                        key={plan.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-3 py-4 font-medium">
                          {plan.season}
                        </td>

                        <td className="px-3 py-4">
                          {plan.date}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              plan.status
                            )}`}
                          >
                            {plan.status}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-gray-600">
                          {plan.memo || "-"}
                        </td>

                        <td className="px-3 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                startEdit(plan)
                              }
                              className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                            >
                              수정
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(plan.id!)
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                            >
                              삭제
                            </button>
                          </div>
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