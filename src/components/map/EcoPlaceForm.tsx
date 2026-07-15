"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useActionState, useState } from "react";
import { createEcoPlaceAction, type PlaceState } from "@/app/actions/places";
import { SubmitButton } from "@/components/SubmitButton";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <div className="skel-hero" style={{ height: 300, marginBottom: 0 }} />
});

const KINDS = [
  { value: "ramassage", icon: "🤝", label: "Événement groupé", desc: "Ramassage de déchets, clean walk, atelier collectif…" },
  { value: "dechetterie", icon: "♻️", label: "Point de collecte", desc: "Déchetterie, borne de tri, compost partagé…" },
  { value: "centre", icon: "🌱", label: "Initiative urbaine", desc: "Jardin partagé, centre écologique, ferme urbaine…" }
] as const;

export function EcoPlaceForm() {
  const [state, formAction] = useActionState<PlaceState, FormData>(createEcoPlaceAction, {});
  const [kind, setKind] = useState<string>("ramassage");
  const [pos, setPos] = useState({ lat: 0, lng: 0 });

  if (state.ok) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }} role="status">
        <div className="onboard-success-icon" style={{ margin: "0 auto 16px" }}>✓</div>
        <div className="auth-h" style={{ fontSize: 24 }}>Lieu ajouté à la carte !</div>
        <p className="auth-sub" style={{ marginBottom: 20 }}>
          Merci pour votre contribution — il est maintenant visible par toute la communauté.
        </p>
        <Link href="/partenaires#carte" className="btn-cta">
          Voir sur la carte →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="lat" value={pos.lat} />
      <input type="hidden" name="lng" value={pos.lng} />

      <div className="form-group">
        <span className="form-lbl">Type de lieu</span>
        <div className="profile-type-grid" style={{ gridTemplateColumns: "1fr", gap: 10, marginBottom: 0 }}>
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              className={`profile-type-card${kind === k.value ? " selected" : ""}`}
              onClick={() => setKind(k.value)}
              style={{ textAlign: "left", padding: "14px 16px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{k.icon}</span>
                <span>
                  <span className="profile-type-name" style={{ display: "block", fontSize: 14 }}>{k.label}</span>
                  <span className="profile-type-desc">{k.desc}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="pl-name">Nom</label>
        <input id="pl-name" className="form-in" type="text" name="name" placeholder="Ramassage plage du Prado, Déchetterie des Épinettes…" required />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="pl-city">Ville</label>
        <input id="pl-city" className="form-in" type="text" name="city" placeholder="Marseille" required />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="pl-schedule">Date / horaires (optionnel)</label>
        <input id="pl-schedule" className="form-in" type="text" name="schedule" placeholder="Chaque 1er samedi du mois, 10h — ou — Lun-Sam 9h-18h" />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="pl-desc">Description</label>
        <textarea id="pl-desc" className="form-textarea" name="description" placeholder="Décrivez le lieu, l'initiative, comment participer…" style={{ minHeight: 90 }} required />
      </div>

      <div className="form-group">
        <span className="form-lbl">
          Position — cliquez sur la carte pour placer le lieu
          {pos.lat !== 0 ? " ✓" : ""}
        </span>
        <div style={{ border: ".5px solid rgba(0,0,0,.1)", borderRadius: 12, overflow: "hidden" }}>
          <LocationPicker lat={pos.lat} lng={pos.lng} onPick={(lat, lng) => setPos({ lat, lng })} />
        </div>
      </div>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Ajout…">
        Ajouter à la carte
      </SubmitButton>
    </form>
  );
}
