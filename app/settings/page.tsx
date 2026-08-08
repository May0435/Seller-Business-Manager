import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function SettingsPage() {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">
          <div className="rounded-xl bg-white p-8 shadow">
            <h1 className="mb-8 text-3xl font-bold">
              Settings
            </h1>

            <div className="space-y-6">

              <div>
                <label className="mb-2 block font-semibold">
                  Cloud Name
                </label>

                <input
                  value="gnmhhmxk"
                  readOnly
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Upload Preset
                </label>

                <input
                  value="etsy-manager"
                  readOnly
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Firebase Project
                </label>

                <input
                  value="etsy-manager-pro"
                  readOnly
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <button className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                저장
              </button>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}