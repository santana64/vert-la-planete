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
        <label className="form-lbl" htmlFor="fld-name">Nom de la boutique</label>
        <input className="form-in" type="text" id="fld-name" name="name" placeholder="La Ferme de Maxime" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-category">Catégorie</label>
          <select className="form-select" id="fld-category" name="category" defaultValue={CATEGORIES[0]}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-region">Région</label>
          <select className="form-select" id="fld-region" name="region" defaultValue={REGIONS[0]}>
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
        <input className="form-in" type="text" id="fld-city" name="city" placeholder="Tours" required />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-tagline">Accroche</label>
        <input
          className="form-in"
          type="text"
          id="fld-tagline" name="tagline"
          placeholder="Maraîcher bio en circuit court"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-description">Présentation</label>
        <textarea
          className="form-textarea"
          id="fld-description" name="description"
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
