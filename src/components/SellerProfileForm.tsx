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
        <label className="form-lbl" htmlFor="fld-name">Nom de la boutique</label>
        <input className="form-in" type="text" id="fld-name" name="name" defaultValue={defaults.name} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-category">Catégorie</label>
          <select className="form-select" id="fld-category" name="category" defaultValue={defaults.category}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-region">Région</label>
          <select className="form-select" id="fld-region" name="region" defaultValue={defaults.region}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-city">Ville</label>
        <input className="form-in" type="text" id="fld-city" name="city" defaultValue={defaults.city} required />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-tagline">Accroche</label>
        <input
          className="form-in"
          type="text"
          id="fld-tagline" name="tagline"
          defaultValue={defaults.tagline}
          placeholder="Votre démarche en une phrase"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-websiteUrl">Site web (optionnel)</label>
        <input
          className="form-in"
          type="url"
          id="fld-websiteUrl" name="websiteUrl"
          defaultValue={defaults.websiteUrl}
          placeholder="https://mon-site.fr"
        />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-description">Présentation</label>
        <textarea
          className="form-textarea"
          id="fld-description" name="description"
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
