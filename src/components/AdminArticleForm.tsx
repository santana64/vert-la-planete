"use client";

import { useActionState } from "react";
import { adminSaveArticle, type AdminFormState } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import type { Article } from "@/db/schema";

export function AdminArticleForm({ article }: { article?: Article }) {
  const [state, formAction] = useActionState<AdminFormState, FormData>(adminSaveArticle, {});

  return (
    <form action={formAction}>
      {article ? <input type="hidden" name="id" value={article.id} /> : null}

      <div className="form-group">
        <label className="form-lbl" htmlFor="a-title">Titre</label>
        <input className="form-in" id="a-title" name="title" defaultValue={article?.title} placeholder="Titre de l'article" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-lbl" htmlFor="a-cat">Catégorie</label>
          <input className="form-in" id="a-cat" name="category" defaultValue={article?.category} placeholder="Zéro déchet, Énergie…" required />
        </div>
        <div className="form-group">
          <label className="form-lbl" htmlFor="a-author">Auteur</label>
          <input className="form-in" id="a-author" name="author" defaultValue={article?.author} placeholder="Rédaction Vert La Planète" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="a-excerpt">Chapô (résumé)</label>
        <textarea className="form-textarea" id="a-excerpt" name="excerpt" defaultValue={article?.excerpt} placeholder="Résumé affiché sur la liste des actualités" required style={{ minHeight: 80 }} />
      </div>

      <div className="form-group">
        <label className="form-lbl" htmlFor="a-body">Contenu</label>
        <textarea className="form-textarea" id="a-body" name="body" defaultValue={article?.body} placeholder="Corps de l'article…" required style={{ minHeight: 220 }} />
      </div>

      <div className="form-group" style={{ maxWidth: 200 }}>
        <label className="form-lbl" htmlFor="a-read">Temps de lecture (min)</label>
        <input className="form-in" id="a-read" name="readMinutes" type="number" min={1} max={60} defaultValue={article?.readMinutes ?? 5} />
      </div>

      {state.error ? <p className="field-error">{state.error}</p> : null}

      <SubmitButton className="form-submit" pendingLabel="Enregistrement…">
        {article ? "Enregistrer les modifications" : "Publier l'article"}
      </SubmitButton>
    </form>
  );
}
