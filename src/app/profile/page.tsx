"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { getStoredUserProfile, syncUserProfileFromToken, UserProfile } from "@/lib/user-profile";

export default function ProfilePage() {
  const router = useRouter();
  const [profile] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token");
    if (!token) return null;
    const storedProfile = getStoredUserProfile();
    if (!storedProfile || !storedProfile.imageUrl) {
      return syncUserProfileFromToken(token);
    }
    return storedProfile;
  });

  useEffect(() => {
    const token = localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  if (!profile) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950 p-8">
        <p className="text-sm text-neutral-300">Unable to load profile details from your current session.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-4 rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
        >
          Sign in again
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5">
      <header>
        <BrandLogo className="mb-3" />
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Profile</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your Account</h1>
        <p className="mt-2 text-sm text-neutral-400">Review details from your Google sign-in profile.</p>
      </header>

      <article className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          {profile.imageUrl ? (
            <Image
              src={profile.imageUrl}
              alt={`${profile.name} profile picture`}
              width={96}
              height={96}
              unoptimized
              className="h-24 w-24 rounded-full border border-neutral-700 object-cover"
              priority
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-3xl font-semibold text-neutral-200">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Signed in as</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{profile.name}</h2>
            <p className="mt-1 text-sm text-neutral-300">{profile.email}</p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
        <h2 className="text-sm font-medium text-white">Profile Details</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-800 bg-black/60 px-4 py-3">
            <dt className="text-xs uppercase tracking-wide text-neutral-400">User ID</dt>
            <dd className="mt-1 break-all text-sm text-neutral-200">{profile.id}</dd>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-black/60 px-4 py-3">
            <dt className="text-xs uppercase tracking-wide text-neutral-400">Email Verified</dt>
            <dd className="mt-1 text-sm text-neutral-200">{profile.emailVerified ? "Yes" : "No"}</dd>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-black/60 px-4 py-3">
            <dt className="text-xs uppercase tracking-wide text-neutral-400">Given Name</dt>
            <dd className="mt-1 text-sm text-neutral-200">{profile.givenName ?? "-"}</dd>
          </div>
        </dl>
      </article>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
        >
          Back to Dashboard
        </button>
      </div>
    </section>
  );
}
