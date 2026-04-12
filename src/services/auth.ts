import { apiRequest, setToken, setRefreshToken, clearTokens } from '../lib/api';
import type { User } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptUser(u: any): User {
  return {
    id: u.id,
    name: u.full_name || u.username,
    handle: u.username,
    avatar:
      u.avatar_url ||
      `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(u.username)}&backgroundColor=FF5C1A`,
    bio: u.bio ?? '',
    eventsHosted: u.events_hosted ?? 0,
    eventsAttended: 0,
    followers: u.followers_count ?? 0,
    following: u.following_count ?? 0,
    badges: [],
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await apiRequest<{
    token: string;
    refresh_token: string;
    user: unknown;
  }>('/api/auth/login', { method: 'POST', body: { email, password } });

  if (error || !data) return { user: null, error: error ?? 'Login failed' };

  setToken(data.token);
  setRefreshToken(data.refresh_token);
  return { user: adaptUser(data.user), error: null };
}

export async function registerUser(params: {
  email: string;
  password: string;
  username: string;
  full_name?: string;
}): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await apiRequest<{
    token: string;
    refresh_token: string;
    user: unknown;
  }>('/api/auth/register', { method: 'POST', body: params });

  if (error || !data) return { user: null, error: error ?? 'Registration failed' };

  setToken(data.token);
  setRefreshToken(data.refresh_token);
  return { user: adaptUser(data.user), error: null };
}

export async function getMe(): Promise<User | null> {
  const { data } = await apiRequest<{ user: unknown }>('/api/auth/me');
  if (!data?.user) return null;
  return adaptUser(data.user);
}

export async function logoutUser(): Promise<void> {
  await apiRequest('/api/auth/logout', { method: 'POST' });
  clearTokens();
}
