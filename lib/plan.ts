import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firestore";

export interface Plan {
  id?: string;

  season: string;
  date: string;

  status:
    | "준비중"
    | "대기"
    | "제작중"
    | "검토"
    | "업로드 예정"
    | "완료";

  memo: string;

  createdAt: number;
  updatedAt: number;
}

export async function addPlan(plan: Plan) {
  await addDoc(collection(db, "plans"), plan);
}

export async function updatePlan(plan: Plan) {
  if (!plan.id) return;

  const { id, ...data } = plan;

  await updateDoc(doc(db, "plans", id), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deletePlan(id: string) {
  await deleteDoc(doc(db, "plans", id));
}