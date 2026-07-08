"use client";

import Link from "next/link";
import { useActionState } from "react";
import { toggleFavoriteAction, type FavoriteState } from "@/app/actions/favorites";

export function FavoriteButton({
  sellerId,
  initial,
  isLoggedIn
}: {
  sellerId: string;
  initial: boolean;
  isLoggedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState<FavoriteState, FormData>(
    toggleFavoriteAction,
    { favorited: initial }
  );
  const favorited = state.favorited ?? initial;

  if (!isLoggedIn) {
    return (
      <Link href="/connexion" className="btn-sm-outline" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        ♡ Ajouter aux favoris
      </Link>
    );
  }

  return (
    <form action={formAction} style={{ display: "inline-block" }}>
      <input type="hidden" name="sellerId" value={sellerId} />
      <button
        type="submit"
        className="btn-sm-outline"
        disabled={pending}
        aria-pressed={favorited}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          color: favorited ? "#c0392b" : undefined,
          borderColor: favorited ? "rgba(192,57,43,.35)" : undefined
        }}
      >
        <span style={{ fontSize: 15 }}>{favorited ? "♥" : "♡"}</span>
        {pending ? "…" : favorited ? "Dans mes favoris" : "Ajouter aux favoris"}
      </button>
    </form>
  );
}
