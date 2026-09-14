"use client";

import { useRef, useState } from "react";

const WIDTH = 1200;
const HEIGHT = 630; // ratio 1200×630 : format standard des bannières d'article / partage social.

/** Compresse l'image côté navigateur (canvas, JPEG) avant envoi — éco-conception. */
async function compressCover(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const ratio = Math.max(WIDTH / bitmap.width, HEIGHT / bitmap.height);
  const w = bitmap.width * ratio;
  const h = bitmap.height * ratio;
  ctx.drawImage(bitmap, (WIDTH - w) / 2, (HEIGHT - h) / 2, w, h);
  return canvas.toDataURL("image/jpeg", 0.78);
}

/**
 * Sélecteur d'image de couverture pour un article (formulaire admin).
 * Même principe que AvatarUpload : compression côté client en data URL,
 * stockée telle quelle en base (colonne `cover_image`, cf. schema.ts).
 * Sans image choisie, l'article garde son dégradé de secours.
 */
export function CoverImageUpload({ initialImage }: { initialImage?: string | null }) {
  const [preview, setPreview] = useState<string | null>(initialImage ?? null);
  const [removed, setRemoved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);
  const removeRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisissez un fichier image (JPEG, PNG…).");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await compressCover(file);
      setPreview(dataUrl);
      setRemoved(false);
      if (dataRef.current) dataRef.current.value = dataUrl;
      if (removeRef.current) removeRef.current.value = "0";
    } catch {
      setError("Impossible de lire cette image — réessayez avec un autre fichier.");
    } finally {
      setBusy(false);
    }
  }

  function onRemove() {
    setPreview(null);
    setRemoved(true);
    if (dataRef.current) dataRef.current.value = "";
    if (removeRef.current) removeRef.current.value = "1";
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="form-group">
      <label className="form-lbl">Image de couverture (facultative)</label>
      <input type="hidden" name="coverImage" ref={dataRef} />
      <input type="hidden" name="removeCoverImage" ref={removeRef} defaultValue="0" />

      {preview ? (
        <div className="cover-preview">
          {/* eslint-disable-next-line @next/next/no-img-element -- aperçu d'une data URL locale, next/image ne l'optimiserait pas. */}
          <img src={preview} alt="" />
        </div>
      ) : (
        <div className="cover-preview cover-preview--empty">
          Sans image, un dégradé de couleur illustre l&apos;article.
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button type="button" className="btn-sm-outline" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? "Traitement…" : preview ? "Changer l'image" : "Choisir une image"}
        </button>
        {preview && !removed ? (
          <button type="button" className="btn-sm-outline" onClick={onRemove}>
            Retirer l&apos;image
          </button>
        ) : null}
      </div>

      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
