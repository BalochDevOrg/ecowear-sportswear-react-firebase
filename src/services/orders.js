import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  updateDoc,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

/** Trusted-client snapshot persisted at checkout (see README security notes). */
function sanitizeNewOrder(payload) {
  const {
    userId,
    customerName,
    email,
    items,
    subtotal,
    shipping,
    total,
    shippingAddress,
  } = payload;

  return {
    userId,
    customerName,
    email,
    items,
    subtotal,
    shipping,
    total,
    shippingAddress,
  };
}

export async function createOrder(orderData) {
  const base = sanitizeNewOrder(orderData);
  const payload = {
    ...base,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "pending",
    /** Surfaces until opened in Admin order detail — README “notifications”. */
    adminRead: false,
  };

  const docRef = await addDoc(collection(db, "orders"), payload);
  return docRef.id;
}

export async function getOrderById(orderId) {
  const ref = doc(db, "orders", orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getOrdersByUser(userId) {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function getAllOrders() {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

/** Admin: update Fulfillment workflow status. */
export async function updateOrderStatus(orderId, status) {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

/** Mark order reviewed in admin UI (notifications / unread badge). */
export async function markOrderAdminRead(orderId) {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    adminRead: true,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Approximate unread new orders count (snapshots capped for performance).
 * Real email/SMS alerts are NOT included — see README (“Notifications”).
 */
export function subscribeUnreadOrdersCount(cb, opts = {}) {
  const maxScan = opts.maxScan ?? 80;
  const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc"),
    limit(maxScan)
  );
  return onSnapshot(
    q,
    (snap) => {
      let u = 0;
      snap.forEach((d) => {
        const data = d.data();
        if (data.adminRead === false || data.adminRead === undefined) u++;
      });
      cb(u);
    },
    (err) => {
      console.warn("Unread orders subscribe failed:", err.message);
      cb(0);
    }
  );
}
