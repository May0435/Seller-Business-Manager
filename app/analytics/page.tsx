import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AnalyticsPage() {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">

          <div className="grid gap-6 md:grid-cols-4">

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-500">총 매출</p>
              <h2 className="mt-3 text-3xl font-bold">$0</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-500">총 판매량</p>
              <h2 className="mt-3 text-3xl font-bold">0</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-500">평균 판매가</p>
              <h2 className="mt-3 text-3xl font-bold">$0</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-500">ROI</p>
              <h2 className="mt-3 text-3xl font-bold">0%</h2>
            </div>

          </div>

          <div className="mt-8 rounded-xl bg-white p-8 shadow">

            <h2 className="mb-6 text-2xl font-bold">
              월별 판매 분석
            </h2>

            <div className="flex h-80 items-center justify-center rounded-lg border-2 border-dashed text-gray-400">
              Chart Coming Soon
            </div>

          </div>

          <div className="mt-8 rounded-xl bg-white p-8 shadow">

            <h2 className="mb-6 text-2xl font-bold">
              베스트셀러 TOP5
            </h2>

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="py-3 text-left">상품명</th>
                  <th className="py-3 text-left">판매량</th>
                  <th className="py-3 text-left">매출</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td className="py-4 text-gray-400">
                    데이터 없음
                  </td>

                  <td>-</td>

                  <td>-</td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}