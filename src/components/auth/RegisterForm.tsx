"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerAction, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export function RegisterForm({ initialRole = "membre" }: { initialRole?: "membre" | "partenaire" }) {
  const [state, formAction] = useActionState<AuthState, FormData>(registerAction, {});
  const [role, setRole] = useState<"membre" | "partenaire">(initialRole);

  return (
    <form action={formAction}>
      <input type="hidden" name="role" value={role} />

      <div className="form-group">
        <label className="form-lbl">Je souhaite</label>
        <div className="product-variant-chips" style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className={`product-variant-chip${role === "membre" ? " on" : ""}`}
            onClick={() => setRole("membre")}
          >
            Membre 🌿
          </button>
          <button
            type="button"
            className={`product-variant-chip${role === "partenaire" ? " on" : ""}`}
            onClick={() => setRole("partenaire")}
          >
            Partenaire 🛍️
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-lbl">Prénom et nom</label>
        <input className="form-in" type="text" name="name" placeholder="Marie Dupont" required />
      </div>
      <div className="form-group">
        <label className="form-lbl">Adresse e-mail</label>
        <input className="form-in" type="email" name="email" placeholder="vous@exemple.fr" required />
      </div>
      <div className="form-group">
        <label className="form-lbl">Mot de passe</label>
        <input
          className="form-in"
          type="password"
          name="password"
          placeholder="8 caractères minimum"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-lbl">Confirmez le mot de passe</label>
        <input
          className="form-in"
          type="password"
          name="confirmPassword"
          placeholder="Retapez le même mot de passe"
          autoComplete="new-password"
          required
        />
      </div>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Création…">
        {role === "partenaire" ? "Créer mon compte partenaire" : "Créer mon compte"}
      </SubmitButton>

      <p style={{ fontSize: 12, color: "var(--sd)", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
        En créant un compte, vous acceptez nos CGU et notre politique de confidentialité.
      </p>
      <p className="form-switch">
        Déjà un compte ? <Link href="/connexion">Se connecter →</Link>
      </p>
    </form>
  );
}
