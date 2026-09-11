import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

function slugFromName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Loads categories; sorted client-side to avoid composite-index / ordering edge cases with legacy rows. */
export async function getCategories() {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}

export async function createCategory({ name, description = "" }) {
  const payload = {
    name: name.trim(),
    slug: slugFromName(name),
    description: description.trim(),
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, "categories"), payload);
}

export async function updateCategory(id, { name, description = "" }) {
  const ref = doc(db, "categories", id);
  await updateDoc(ref, {
    name: name.trim(),
    slug: slugFromName(name),
    description: description.trim(),
  });
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, "categories", id));
}

/**
 * Admin helper — skips category names already present.
 */
export async function seedDefaultCategories() {
  const existing = await getCategories();
  const lower = new Set(existing.map((c) => String(c.name || "").toLowerCase()));
  const defaults = [
    "Tops",
    "Bottoms",
    "Outerwear",
    "Accessories",
  ];

  for (const name of defaults) {
    if (lower.has(name.toLowerCase())) continue;
    await createCategory({ name, description: `EcoWear default group: ${name}` });
    lower.add(name.toLowerCase());
  }
}
