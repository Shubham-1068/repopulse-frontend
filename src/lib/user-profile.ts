export const PROFILE_STORAGE_KEY = "rp_user_profile";

type JwtPayload = {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  email_verified?: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  givenName?: string;
  familyName?: string;
  locale?: string;
  emailVerified?: boolean;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function parseJwtPayload(token: string): JwtPayload | null {
  const segments = token.split(".");
  if (segments.length < 2) return null;

  try {
    const base64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddingLength = (4 - (base64.length % 4)) % 4;
    const padded = `${base64}${"=".repeat(paddingLength)}`;
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const payloadJson = new TextDecoder().decode(bytes);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}

export function buildUserProfileFromToken(token: string): UserProfile | null {
  const payload = parseJwtPayload(token);
  if (!payload?.sub || !payload.name || !payload.email) {
    return null;
  }

  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    imageUrl: payload.picture ?? "",
    givenName: payload.given_name,
    familyName: payload.family_name,
    locale: payload.locale,
    emailVerified: payload.email_verified,
  };
}

export function getStoredUserProfile(): UserProfile | null {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed.id || !parsed.name || !parsed.email) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile) {
  if (!isBrowser()) return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function syncUserProfileFromToken(token: string): UserProfile | null {
  const profile = buildUserProfileFromToken(token);
  if (!profile) return null;
  saveUserProfile(profile);
  return profile;
}

export function clearStoredUserProfile() {
  if (!isBrowser()) return;
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}