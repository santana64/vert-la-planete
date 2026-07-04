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
        <label className="form-lbl">Nom du produit</label>
        <input className="form-in" type="text" name="name" defaultValue={defaults.name} placeholder="Panier de légumes bio" required />
      </div>

      <div className="form-group">
        <label className="form-lbl">Description</label>
        <textarea
          className="form-textarea"
          name="description"
          defaultValue={defaults.description}
          placeholder="Présentez votre produit, son origine, sa démarche écologique…"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl">Prix (€)</label>
          <input className="form-in" type="text" name="price" defaultValue={defaults.price} placeholder="18,00" required />
        </div>
        <div className="form-group">
          <label className="form-lbl">Unité (optionnel)</label>
          <input className="form-in" type="text" name="unit" defaultValue={defaults.unit} placeholder="/ kg, / semaine…" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl">Catégorie</label>
          <select className="form-select" name="category" defaultValue={defaults.category ?? CATEGORIES[0]}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-lbl">Label (optionnel)</label>
          <select className="form-select" name="badge" defaultValue={defaults.badge ?? ""}>
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
        <label className="form-lbl">Visuel</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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

      <label
        className="form-group"
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        <input type="checkbox" name="isNew" defaultChecked={defaults.isNew ?? true} />
        <span style={{ fontSize: 13, color: "var(--f)" }}>Mettre en avant comme nouveauté</span>
      </label>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Enregistrement…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
