import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firestore";

import type { Product } from "./product";

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

  await updateDoc(doc(db, "products", id), data);
}