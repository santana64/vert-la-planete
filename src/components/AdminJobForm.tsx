"use client";

import { useActionState } from "react";
import { adminSaveJob, type AdminFormState } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import type { Job } from "@/db/schema";

export function AdminJobForm({ job }: { job?: Job }) {
  const [state, formAction] = useActionState<AdminFormState, FormData>(adminSaveJob, {});

  return (
    <form action={formAction}>
      {job ? <input type="hidden" name="id" value={job.id} /> : null}

      <div className="form-group">
        <label className="form-lbl" htmlFor="j-title">Intitulé</label>
        <input className="form-in" id="j-title" name="title" defaultValue={job?.title} placeholder="Maraîcher·ère en circuit court" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="j-kind">Type</label>
          <select className="form-select" id="j-kind" name="kind" defaultValue={job?.kind ?? "Emploi"}>
            <option>Emploi</option>
            <option>Formation</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="j-contract">Contrat</label>
          <input className="form-in" id="j-contract" name="contractType" defaultValue={job?.contractType} placeholder="CDI, CDD, Alternance, Formation courte…" required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="j-org">Organisation</label>
          <input className="form-in" id="j-org" name="organisation" defaultValue={job?.organisation} placeholder="Nom de la structure" required />
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="j-loc">Lieu</label>
          <input className="form-in" id="j-loc" name="location" defaultValue={job?.location} placeholder="Nantes (44)" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="j-desc">Description</label>
        <textarea className="form-textarea" id="j-desc" name="description" defaultValue={job?.description} placeholder="Missions, profil, conditions…" required style={{ minHeight: 200 }} />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="j-url">Lien de candidature (optionnel)</label>
        <input className="form-in" id="j-url" name="contactUrl" type="url" defaultValue={job?.contactUrl ?? ""} placeholder="https://…" />
      </div>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Enregistrement…">
        {job ? "Enregistrer les modifications" : "Publier l'offre"}
      </SubmitButton>
    </form>
  );
}
