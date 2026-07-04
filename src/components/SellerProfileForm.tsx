"use client";

import { useActionState } from "react";
import { updateSellerProfileAction, type SellerFormState } from "@/app/actions/seller";
import { SubmitButton } from "@/components/SubmitButton";
import { CATEGORIES, REGIONS } from "@/lib/constants";

export type SellerProfileDefaults = {
  name: string;
  category: string;
  tagline: string;
  description: string;
  city: string;
  region: string;
  websiteUrl: string;
};

export function SellerProfileForm({ defaults }: { defaults: SellerProfileDefaults }) {
  const [state, formAction] = useActionState<SellerFormState, FormData>(
    updateSellerProfileAction,
    {}
  );

  return (
    <form action={formAction}>
      <div className="form-group">
        <label className="form-lbl">Nom de la boutique</label>
        <input className="form-in" type="text" name="name" defaultValue={defaults.name} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl">Catégorie</label>
          <select className="form-select" name="category" defaultValue={defaults.category}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-lbl">Région</label>
          <select className="form-select" name="region" defaultValue={defaults.region}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-lbl">Ville</label>
        <input className="form-in" type="text" name="city" defaultValue={defaults.city} required />
      </div>

      <div className="form-group">
        <label className="form-lbl">Accroche</label>
        <input
          className="form-in"
          type="text"
          name="tagline"
          defaultValue={defaults.tagline}
          placeholder="Votre démarche en une phrase"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-lbl">Site web (optionnel)</label>
        <input
          className="form-in"
          type="url"
          name="websiteUrl"
          defaultValue={defaults.websiteUrl}
          placeholder="https://mon-site.fr"
        />
      </div>

      <div className="form-group">
        <label className="form-lbl">Présentation</label>
        <textarea
          className="form-textarea"
          name="description"
          defaultValue={defaults.description}
          required
        />
      </div>

      {state.error ? <p className="field-error">{state.error}</p> : null}
      {state.ok ? (
        <p style={{ fontSize: 13, color: "var(--s)", fontWeight: 500, marginBottom: 8 }}>
          ✓ Boutique mise à jour
        </p>
      ) : null}

      <SubmitButton className="form-submit" pendingLabel="Enregistrement…">
        Enregistrer
      </SubmitButton>
    </form>
  );
}
