import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function FilesPage() {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">
          <div className="rounded-xl bg-white p-8 shadow">
            <h1 className="mb-6 text-3xl font-bold">Files</h1>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  PDF 업로드
                </h2>

                <input
                  type="file"
                  accept=".pdf"
                  className="w-full"
                />
              </div>

              <div className="rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  ZIP 업로드
                </h2>

                <input
                  type="file"
                  accept=".zip"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}