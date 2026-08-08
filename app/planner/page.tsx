import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const plans = [
  {
    season: "🎃 Halloween",
    date: "2026-09-01",
    status: "준비중",
  },
  {
    season: "🎄 Christmas",
    date: "2026-11-01",
    status: "대기",
  },
  {
    season: "🌸 Spring",
    date: "2027-02-01",
    status: "대기",
  },
  {
    season: "☀️ Summer",
    date: "2027-05-01",
    status: "대기",
  },
];

export default function PlannerPage() {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">

          <div className="rounded-xl bg-white p-8 shadow">

            <h1 className="mb-8 text-3xl font-bold">
              Release Planner
            </h1>

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="py-4 text-left">
                    시즌
                  </th>

                  <th className="py-4 text-left">
                    출시일
                  </th>

                  <th className="py-4 text-left">
                    상태
                  </th>

                </tr>

              </thead>

              <tbody>

                {plans.map((plan) => (
                  <tr
                    key={plan.season}
                    className="border-b"
                  >
                    <td className="py-5">
                      {plan.season}
                    </td>

                    <td>
                      {plan.date}
                    </td>

                    <td>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                        {plan.status}
                      </span>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}