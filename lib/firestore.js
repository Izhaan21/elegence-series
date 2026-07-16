import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ── PRODUCTS ──────────────────────────────────────────────

export async function getProducts({ category, featured, limitCount, status } = {}) {
  let q = collection(db, 'products');
  const constraints = [];
  // Only add where clauses — avoid mixing where() + orderBy() which requires a composite index
  if (category) constraints.push(where('category', '==', category));
  if (featured) constraints.push(where('featured', '==', true));
  if (status) constraints.push(where('status', '==', status));
  // Only use orderBy when no where clauses (avoids composite index requirement)
  if (constraints.length === 0) {
    constraints.push(orderBy('createdAt', 'desc'));
  }
  if (limitCount) constraints.push(limit(limitCount));
  const snap = await getDocs(query(q, ...constraints));
  // Sort client-side if we skipped orderBy
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return docs.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
}

export async function getProductBySlug(slug) {
  const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getProductById(id) {
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function addProduct(data) {
  return addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, 'products', id));
}

// ── CATEGORIES ────────────────────────────────────────────

export async function getCategories() {
  const snap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addCategory(data) {
  return addDoc(collection(db, 'categories'), { ...data, createdAt: serverTimestamp() });
}

export async function updateCategory(id, data) {
  return updateDoc(doc(db, 'categories', id), data);
}

export async function deleteCategory(id) {
  return deleteDoc(doc(db, 'categories', id));
}

// ── ORDERS ────────────────────────────────────────────────

export async function getOrders() {
  const snap = await getDocs(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getOrderById(id) {
  const snap = await getDoc(doc(db, 'orders', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getOrderByStripeSession(sessionId) {
  const q = query(
    collection(db, 'orders'),
    where('stripeSessionId', '==', sessionId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createOrder(data) {
  return addDoc(collection(db, 'orders'), {
    ...data,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function updateOrderStatus(id, { orderStatus, paymentStatus } = {}) {
  const updates = { updatedAt: serverTimestamp() };
  if (orderStatus) updates.orderStatus = orderStatus;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  return updateDoc(doc(db, 'orders', id), updates);
}

// ── SETTINGS ──────────────────────────────────────────────

export async function getSettings() {
  const snap = await getDoc(doc(db, 'settings', 'global'));
  if (!snap.exists()) return {};
  return snap.data();
}

export async function updateSettings(data) {
  return updateDoc(doc(db, 'settings', 'global'), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── ADMIN CHECK ───────────────────────────────────────────

export async function isAdminUser(uid) {
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists();
}

// ── DASHBOARD STATS ───────────────────────────────────────

export async function getDashboardStats() {
  const [ordersSnap, productsSnap] = await Promise.all([
    getDocs(collection(db, 'orders')),
    getDocs(collection(db, 'products')),
  ]);

  const orders = ordersSnap.docs.map((d) => d.data());
  const totalSales = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const newOrders = orders.filter((o) => o.orderStatus === 'pending').length;

  const products = productsSnap.docs.map((d) => d.data());
  const stockAlerts = products.filter((p) => (p.stockQty || 0) < 5).length;

  return { totalSales, newOrders, totalOrders: orders.length, stockAlerts };
}

// ── MESSAGES (CONTACT FORM) ────────────────────────────────
export async function createMessage(data) {
  const messagesRef = collection(db, 'messages');
  await addDoc(messagesRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getMessages() {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toMillis() || Date.now(),
  }));
}

export async function deleteMessage(id) {
  const docRef = doc(db, 'messages', id);
  await deleteDoc(docRef);
}
