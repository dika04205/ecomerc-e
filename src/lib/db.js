import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');

function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return filename.endsWith('.json') && filename.includes('wishlists') ? {} : [];
  }
}

function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Products
export function getProducts() {
  return readJSON('products.json');
}

export function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
}

export function createProduct(product) {
  const products = getProducts();
  products.push(product);
  writeJSON('products.json', products);
  return product;
}

export function updateProduct(id, updates) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  writeJSON('products.json', products);
  return products[index];
}

export function deleteProduct(id) {
  let products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products = products.filter(p => p.id !== id);
  writeJSON('products.json', products);
  return true;
}

// Users
export function getUsers() {
  return readJSON('users.json');
}

export function getUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

export function getUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
}

export function createUser(user) {
  const users = getUsers();
  users.push(user);
  writeJSON('users.json', users);
  return user;
}

// Sessions
export function getSessions() {
  const data = readJSON('sessions.json');
  return typeof data === 'object' && !Array.isArray(data) ? data : {};
}

export function createSession(token, userId) {
  const sessions = getSessions();
  sessions[token] = { userId, createdAt: new Date().toISOString() };
  writeJSON('sessions.json', sessions);
}

export function getSession(token) {
  const sessions = getSessions();
  return sessions[token] || null;
}

export function deleteSession(token) {
  const sessions = getSessions();
  delete sessions[token];
  writeJSON('sessions.json', sessions);
}

// Orders
export function getOrders() {
  return readJSON('orders.json');
}

export function getOrderById(id) {
  const orders = getOrders();
  return orders.find(o => o.id === id) || null;
}

export function getOrdersByUserId(userId) {
  const orders = getOrders();
  return orders.filter(o => o.userId === userId);
}

export function createOrder(order) {
  const orders = getOrders();
  orders.push(order);
  writeJSON('orders.json', orders);
  return order;
}

export function updateOrder(id, updates) {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates };
  writeJSON('orders.json', orders);
  return orders[index];
}

// Reviews
export function getReviews() {
  return readJSON('reviews.json');
}

export function getReviewsByProductId(productId) {
  const reviews = getReviews();
  return reviews.filter(r => r.productId === productId);
}

export function createReview(review) {
  const reviews = getReviews();
  reviews.push(review);
  writeJSON('reviews.json', reviews);
  return review;
}

// Wishlists
export function getWishlists() {
  const data = readJSON('wishlists.json');
  return typeof data === 'object' && !Array.isArray(data) ? data : {};
}

export function getWishlistByUserId(userId) {
  const wishlists = getWishlists();
  return wishlists[userId] || [];
}

export function addToWishlist(userId, productId) {
  const wishlists = getWishlists();
  if (!wishlists[userId]) wishlists[userId] = [];
  if (!wishlists[userId].includes(productId)) {
    wishlists[userId].push(productId);
  }
  writeJSON('wishlists.json', wishlists);
  return wishlists[userId];
}

export function removeFromWishlist(userId, productId) {
  const wishlists = getWishlists();
  if (!wishlists[userId]) return [];
  wishlists[userId] = wishlists[userId].filter(id => id !== productId);
  writeJSON('wishlists.json', wishlists);
  return wishlists[userId];
}
