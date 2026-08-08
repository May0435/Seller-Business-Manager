import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { db } from "./firestore";

export interface FileItem {
  id?: string;

  name: string;
  url: string;
  type: "pdf" | "zip";

  size: number;

  createdAt: number;
}

export async function addFile(file: FileItem) {
  await addDoc(collection(db, "files"), file);
}

export async function getFiles(): Promise<FileItem[]> {
  const snapshot = await getDocs(collection(db, "files"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<FileItem, "id">),
  }));
}

export async function deleteFile(id: string) {
  await deleteDoc(doc(db, "files", id));
}