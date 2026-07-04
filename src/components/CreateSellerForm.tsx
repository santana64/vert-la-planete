"use client";

import { useActionState } from "react";
import { createSellerAction, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { CATEGORIES, REGIONS } from "@/lib/constants";

export function CreateSellerForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(createSellerAction, {});

  return (
    <form action={formAction}>
      <div className="form-group">
        <label className="form-lbl">Nom de la boutique</label>
        <input className="form-in" type="text" name="name" placeholder="La Ferme de Maxime" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl">Catégorie</label>
          <select className="form-select" name="category" defaultValue={CATEGORIES[0]}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-lbl">Région</label>
          <select className="form-select" name="region" defaultValue={REGIONS[0]}>
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
        <input className="form-in" type="text" name="city" placeholder="Tours" required />
      </div>

      <div className="form-group">
        <label className="form-lbl">Accroche</label>
        <input
          className="form-in"
          type="text"
          name="tagline"
          placeholder="Maraîcher bio en circuit court"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-lbl">Présentation</label>
        <textarea
          className="form-textarea"
          name="description"
          placeholder="Présentez votre activité, votre démarche écologique, vos produits…"
          required
        />
      </div>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Création…">
        Ouvrir ma boutique
      </SubmitButton>
    </form>
  );
}
