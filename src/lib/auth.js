import crypto from 'crypto';
import { getUserByEmail, getUserById, createUser as dbCreateUser, createSession, getSession, deleteSession } from './db';
import { cookies } from 'next/headers';

// Simple password hashing using crypto (no external dependency needed)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verify;
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function registerUser(name, email, password) {
  const existing = getUserByEmail(email);
  if (existing) {
    return { error: 'Email already registered' };
  }

  const user = {
    id: `user_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`,
    name,
    email,
    password: hashPassword(password),
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  dbCreateUser(user);

  const token = generateToken();
  createSession(token, user.id);

  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });

  const { password: _, ...safeUser } = user;
  return { user: safeUser };
}

export async function loginUser(email, password) {
  const user = getUserByEmail(email);
  if (!user) {
    return { error: 'Invalid email or password' };
  }

  if (!verifyPassword(password, user.password)) {
    return { error: 'Invalid email or password' };
  }

  const token = generateToken();
  createSession(token, user.id);

  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });

  const { password: _, ...safeUser } = user;
  return { user: safeUser };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (token) {
    deleteSession(token);
    cookieStore.delete('session_token');
  }
  return { success: true };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;

  const session = getSession(token);
  if (!session) return null;

  const user = getUserById(session.userId);
  if (!user) return null;

  const { password: _, ...safeUser } = user;
  return safeUser;
}
