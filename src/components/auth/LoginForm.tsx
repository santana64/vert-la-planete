"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<AuthState, FormData>(loginAction, {});

  return (
    <form action={formAction}>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="form-group">
        <label className="form-lbl">Adresse e-mail</label>
        <input className="form-in" type="email" name="email" placeholder="vous@exemple.fr" required />
      </div>
      <div className="form-group">
        <label className="form-lbl">Mot de passe</label>
        <input className="form-in" type="password" name="password" placeholder="••••••••" required />
      </div>

      <label
        style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginBottom: 6, fontSize: 13, color: "var(--st)" }}
      >
        <input type="checkbox" name="remember" defaultChecked style={{ accentColor: "var(--s)", width: 16, height: 16 }} />
        Se souvenir de moi
      </label>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Connexion…">
        Se connecter
      </SubmitButton>

      <p className="form-switch">
        Pas encore de compte ? <Link href="/inscription">S&apos;inscrire →</Link>
      </p>
    </form>
  );
}
