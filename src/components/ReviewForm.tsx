"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { addReviewAction, type ReviewState } from "@/app/actions/reviews";
import { SubmitButton } from "@/components/SubmitButton";

export function ReviewForm({
  sellerId,
  isLoggedIn,
  isOwner
}: {
  sellerId: string;
  isLoggedIn: boolean;
  isOwner: boolean;
}) {
  const [state, formAction] = useActionState<ReviewState, FormData>(addReviewAction, {});
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (isOwner) return null;

  if (!isLoggedIn) {
    return (
      <p style={{ fontSize: 13, color: "var(--pb)", fontWeight: 300, marginTop: 14 }}>
        <Link href="/connexion" style={{ color: "var(--s)", fontWeight: 500 }}>
          Connectez-vous
        </Link>{" "}
        pour laisser un avis sur ce partenaire.
      </p>
    );
  }

  if (state.ok) {
    return (
      <p style={{ fontSize: 13, color: "var(--s)", fontWeight: 500, marginTop: 14 }} role="status">
        ✓ Merci pour votre avis ! Il est maintenant visible sur la fiche.
      </p>
    );
  }

  return (
    <form action={formAction} style={{ marginTop: 18, maxWidth: 560 }}>
      <input type="hidden" name="sellerId" value={sellerId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="form-group">
        <span className="form-lbl">Votre note</span>
        <div style={{ display: "flex", gap: 4 }} role="radiogroup" aria-label="Note sur 5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                fontSize: 26,
                lineHeight: 1,
                color: star <= (hover || rating) ? "#e8a020" : "var(--dw)",
                transition: "color .12s, transform .12s",
                transform: star <= hover ? "scale(1.15)" : "none"
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="rv-body">
          Votre avis
        </label>
        <textarea
          id="rv-body"
          className="form-textarea"
          name="body"
          placeholder="Partagez votre expérience avec ce partenaire…"
          style={{ minHeight: 90 }}
          required
        />
      </div>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="btn-primary" pendingLabel="Publication…">
        Publier mon avis
      </SubmitButton>
    </form>
  );
}
