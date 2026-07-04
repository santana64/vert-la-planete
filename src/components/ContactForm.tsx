"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
        <div className="contact-form-h" style={{ marginBottom: 6 }}>
          Message envoyé
        </div>
        <p className="contact-form-sub">
          Merci ! Nous revenons vers vous au plus vite.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl">Prénom</label>
          <input className="form-in" type="text" placeholder="Marie" required />
        </div>
        <div className="form-group">
          <label className="form-lbl">Nom</label>
          <input className="form-in" type="text" placeholder="Dupont" required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-lbl">Adresse e-mail</label>
        <input className="form-in" type="email" placeholder="vous@exemple.fr" required />
      </div>
      <div className="form-group">
        <label className="form-lbl">Vous êtes</label>
        <select className="form-select" defaultValue="Acheteur">
          <option>Acheteur</option>
          <option>Producteur / artisan</option>
          <option>Marque engagée</option>
          <option>Presse</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-lbl">Votre message</label>
        <textarea className="form-textarea" placeholder="Votre question ou votre demande…" required />
      </div>
      <button className="form-submit" type="submit">
        Envoyer le message
      </button>
    </form>
  );
}
