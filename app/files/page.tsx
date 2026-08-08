"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { db } from "@/lib/firestore";
import {
  addFile,
  deleteFile,
  FileItem,
} from "@/lib/file";
import { uploadFile } from "@/lib/cloudinary";

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "files"),
      (snapshot) => {
        const list: FileItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<FileItem, "id">),
        }));

        setFiles(list);
      },
      (error) => {
        console.error(
          "파일 목록을 불러오지 못했습니다.",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  async function handleUpload(
    file: File | null,
    type: "pdf" | "zip"
  ) {
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    try {
      setLoading(true);

      const url = await uploadFile(file);

      await addFile({
        name: file.name,
        url,
        type,
        size: file.size,
        createdAt: Date.now(),
      });

      alert("파일이 업로드되었습니다.");

      if (type === "pdf") {
        setPdfFile(null);
      } else {
        setZipFile(null);
      }
    } catch (error) {
      console.error("파일 업로드 오류:", error);

      alert(
        error instanceof Error
          ? error.message
          : "파일 업로드에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = confirm(
      "이 파일을 삭제하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteFile(id);

      alert("파일이 삭제되었습니다.");
    } catch (error) {
      console.error("파일 삭제 오류:", error);

      alert(
        error instanceof Error
          ? error.message
          : "파일 삭제에 실패했습니다."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function formatSize(size: number) {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">
          {/* 제목 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Files
            </h1>

            <p className="mt-2 text-gray-500">
              Etsy 상품에 사용하는 PDF와 ZIP 파일을 관리하세요.
            </p>
          </div>

          {/* 업로드 영역 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* PDF */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">
                PDF 업로드
              </h2>

              <input
                type="file"
                accept=".pdf,application/pdf"
                className="mb-4 w-full"
                onChange={(e) => {
                  setPdfFile(
                    e.target.files?.[0] ?? null
                  );
                }}
              />

              {pdfFile && (
                <p className="mb-4 text-sm text-gray-600">
                  선택된 파일: {pdfFile.name}
                </p>
              )}

              <button
                onClick={() =>
                  handleUpload(pdfFile, "pdf")
                }
                disabled={loading}
                className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading
                  ? "업로드 중..."
                  : "PDF 업로드"}
              </button>
            </div>

            {/* ZIP */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">
                ZIP 업로드
              </h2>

              <input
                type="file"
                accept=".zip,application/zip"
                className="mb-4 w-full"
                onChange={(e) => {
                  setZipFile(
                    e.target.files?.[0] ?? null
                  );
                }}
              />

              {zipFile && (
                <p className="mb-4 text-sm text-gray-600">
                  선택된 파일: {zipFile.name}
                </p>
              )}

              <button
                onClick={() =>
                  handleUpload(zipFile, "zip")
                }
                disabled={loading}
                className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading
                  ? "업로드 중..."
                  : "ZIP 업로드"}
              </button>
            </div>
          </div>

          {/* 파일 목록 */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              업로드된 파일
            </h2>

            {files.length === 0 ? (
              <p className="py-8 text-center text-gray-400">
                업로드된 파일이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {files
                  .slice()
                  .sort(
                    (a, b) =>
                      b.createdAt - a.createdAt
                  )
                  .map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-4 rounded-lg border p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {file.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {file.type.toUpperCase()} ·{" "}
                          {formatSize(file.size)}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          열기
                        </a>

                        <button
                          onClick={() =>
                            handleDelete(file.id!)
                          }
                          disabled={
                            deletingId === file.id
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:bg-gray-400"
                        >
                          {deletingId === file.id
                            ? "삭제 중..."
                            : "삭제"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}