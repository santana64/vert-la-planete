"use client";

import { useActionState, useState } from "react";
import type { SellerFormState } from "@/app/actions/seller";
import { SubmitButton } from "@/components/SubmitButton";
import { BADGES, CATEGORIES, GRADIENTS } from "@/lib/constants";

type Action = (prev: SellerFormState, formData: FormData) => Promise<SellerFormState>;

export type ProductFormDefaults = {
  productId?: string;
  name?: string;
  description?: string;
  price?: string;
  unit?: string;
  category?: string;
  badge?: string;
  gradient?: string;
  isNew?: boolean;
  origin?: string;
  materials?: string;
  impactNote?: string;
  labels?: string;
};

export function SellerProductForm({
  action,
  defaults = {},
  submitLabel
}: {
  action: Action;
  defaults?: ProductFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<SellerFormState, FormData>(action, {});
  const [gradient, setGradient] = useState(defaults.gradient ?? GRADIENTS[0]);

  return (
    <form action={formAction}>
      {defaults.productId ? <input type="hidden" name="productId" value={defaults.productId} /> : null}
      <input type="hidden" name="gradient" value={gradient} />

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-name">Nom du produit</label>
        <input className="form-in" type="text" id="fld-name" name="name" defaultValue={defaults.name} placeholder="Panier de légumes bio" required />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-description">Description</label>
        <textarea
          className="form-textarea"
          id="fld-description" name="description"
          defaultValue={defaults.description}
          placeholder="Présentez votre produit, son origine, sa démarche écologique…"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-price">Prix (€)</label>
          <input className="form-in" type="text" id="fld-price" name="price" defaultValue={defaults.price} placeholder="18,00" required />
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-unit">Unité (optionnel)</label>
          <input className="form-in" type="text" id="fld-unit" name="unit" defaultValue={defaults.unit} placeholder="/ kg, / semaine…" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-category">Catégorie</label>
          <select className="form-select" id="fld-category" name="category" defaultValue={defaults.category ?? CATEGORIES[0]}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-badge">Label (optionnel)</label>
          <select className="form-select" id="fld-badge" name="badge" defaultValue={defaults.badge ?? ""}>
            <option value="">Aucun</option>
            {BADGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <span className="form-lbl" style={{ display: "block" }}>Visuel</span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} role="group" aria-label="Choix du visuel">
          {GRADIENTS.map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setGradient(g)}
              aria-label="Choisir un visuel"
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: g,
                border: gradient === g ? "2px solid var(--s)" : "2px solid transparent",
                boxShadow: gradient === g ? "0 0 0 2px var(--dw)" : "none",
                cursor: "pointer"
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ margin: "10px 0 4px", paddingTop: 16, borderTop: ".5px solid rgba(0,0,0,.08)" }}>
        <span className="form-lbl" style={{ display: "block", marginBottom: 2 }}>Impact & traçabilité <span style={{ color: "var(--sd)", fontWeight: 400 }}>(optionnel — renforce votre crédibilité)</span></span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-origin">Provenance / traçabilité</label>
          <input className="form-in" type="text" id="fld-origin" name="origin" defaultValue={defaults.origin} placeholder="Fabriqué en Bretagne, coton Inde certifié…" />
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="fld-materials">Composition / matériaux</label>
          <input className="form-in" type="text" id="fld-materials" name="materials" defaultValue={defaults.materials} placeholder="100% lin français, bois FSC…" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-impact">Bénéfice écologique</label>
        <textarea
          className="form-textarea"
          id="fld-impact" name="impactNote"
          defaultValue={defaults.impactNote}
          placeholder="Ex : évite ~2 kg de CO₂ vs neuf · zéro plastique · circuit court…"
          style={{ minHeight: 70 }}
        />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="fld-labels">Labels / certifications</label>
        <input className="form-in" type="text" id="fld-labels" name="labels" defaultValue={defaults.labels} placeholder="Bio, GOTS, Made in France (séparés par des virgules)" />
      </div>

      <label
        className="form-group"
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginTop: 8 }}
      >
        <input type="checkbox" id="fld-isNew" name="isNew" defaultChecked={defaults.isNew ?? true} />
        <span style={{ fontSize: 13, color: "var(--f)" }}>Mettre en avant comme nouveauté</span>
      </label>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Enregistrement…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
