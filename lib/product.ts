import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firestore";

export interface Product {
  id?: string;

  sku: string;

  title: string;
  description: string;

  price: number;

  imageUrl: string;

  etsyUrl: string;

  sales: number;
  revenue: number;
  views: number;
  favorites: number;

  status: "draft" | "published";

  season: string;

  tags: string[];

  memo: string;

  createdAt: number;
  updatedAt: number;
}

export async function addProduct(product: Product) {
  await addDoc(collection(db, "products"), product);
}

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}

export async function updateProduct(product: Product) {
  if (!product.id) return;

  const { id, ...data } = product;

  data.updatedAt = Date.now();

  await updateDoc(doc(db, "products", id), data);
}