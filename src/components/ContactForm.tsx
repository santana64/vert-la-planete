"use client";

import { useActionState } from "react";
import { sendContactAction, type ContactState } from "@/app/actions/contact";
import { SubmitButton } from "@/components/SubmitButton";

const PROFILES = ["Acheteur", "Producteur / artisan", "Marque engagée", "Presse", "Autre"];

export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(sendContactAction, {});

  if (state.ok) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }} role="status">
        <div className="onboard-success-icon" style={{ margin: "0 auto 16px", width: 64, height: 64, fontSize: 28 }}>
          ✓
        </div>
        <div className="contact-form-h" style={{ marginBottom: 6 }}>
          Message envoyé
        </div>
        <p className="contact-form-sub">
          Merci ! Votre message a bien été enregistré — nous revenons vers vous au plus vite.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {/* Honeypot anti-spam — invisible pour les humains */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
      />
      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="ct-first">Prénom</label>
          <input id="ct-first" className="form-in" type="text" name="firstName" placeholder="Marie" required />
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="ct-last">Nom</label>
          <input id="ct-last" className="form-in" type="text" name="lastName" placeholder="Dupont" required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-lbl" htmlFor="ct-email">Adresse e-mail</label>
        <input id="ct-email" className="form-in" type="email" name="email" placeholder="vous@exemple.fr" required />
      </div>
      <div className="form-group">
        <label className="form-lbl" htmlFor="ct-profile">Vous êtes</label>
        <select id="ct-profile" className="form-select" name="profile" defaultValue={PROFILES[0]}>
          {PROFILES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-lbl" htmlFor="ct-message">Votre message</label>
        <textarea
          id="ct-message"
          className="form-textarea"
          name="message"
          placeholder="Votre question ou votre demande…"
          required
        />
      </div>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Envoi…">
        Envoyer le message
      </SubmitButton>
    </form>
  );
}
