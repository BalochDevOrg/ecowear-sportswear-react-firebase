import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/** Loads all products (sorted client-side so legacy rows without `title` still appear). */
export async function getProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
    }))
    .sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
}

export async function getProductById(id) {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Not found");
  return { id: snap.id, ...snap.data() };
}

export async function createProduct(product) {
  await addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id, patch) {
  const ref = doc(db, "products", id);
  await updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}

/** Admin-only helper — adds sample apparel rows (Firestore rules must allow admins). */
export async function seedProducts() {
  const sampleProducts = [
    {
      title: "Eco Training Tee",
      price: 29.99,
      categoryId: "",
      categoryName: "Tops",
      category: "Tops",
      description:
        "Lightweight eco-friendly training t-shirt made from recycled fabric.",
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      inStock: true,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Green", "White"],
    },
    {
      title: "Sustainable Running Shorts",
      price: 34.99,
      categoryId: "",
      categoryName: "Bottoms",
      category: "Bottoms",
      description: "Comfortable running shorts made with low-impact materials.",
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
      inStock: true,
      sizes: ["S", "M", "L"],
      colors: ["Black", "Grey", "Teal"],
    },
    {
      title: "Organic Performance Hoodie",
      price: 54.99,
      categoryId: "",
      categoryName: "Outerwear",
      category: "Outerwear",
      description:
        "Premium hoodie built for training and everyday comfort.",
      imageUrl:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
      inStock: true,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Green", "Pink"],
    },
  ];

  for (const product of sampleProducts) {
    await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
