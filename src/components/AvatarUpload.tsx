"use client";

import { useActionState, useRef, useState } from "react";
import { updateAvatarAction, type AvatarState } from "@/app/actions/account";

/** Compresse l'image côté client (canvas 256px, JPEG) avant envoi — éco-conception. */
async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const ratio = Math.max(size / bitmap.width, size / bitmap.height);
  const w = bitmap.width * ratio;
  const h = bitmap.height * ratio;
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function AvatarUpload({
  initials,
  avatarUrl
}: {
  initials: string;
  avatarUrl: string | null;
}) {
  const [state, formAction] = useActionState<AvatarState, FormData>(updateAvatarAction, {});
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);

  const shown = preview ?? avatarUrl;

  async function onFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      setPreview(dataUrl);
      if (dataRef.current) dataRef.current.value = dataUrl;
      formRef.current?.requestSubmit();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form action={formAction} ref={formRef}>
      <input type="hidden" name="avatar" ref={dataRef} />
      <button
        type="button"
        className="p-av"
        onClick={() => inputRef.current?.click()}
        title="Changer ma photo de profil"
        aria-label="Importer une photo de profil"
        style={{
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          backgroundImage: shown ? `url(${shown})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {!shown ? initials : null}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(9,31,18,.65)",
            color: "#fff",
            fontSize: 10,
            fontFamily: "var(--sans)",
            padding: "3px 0",
            textAlign: "center"
          }}
        >
          {busy ? "…" : "📷 Modifier"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {state.error ? (
        <p className="field-error" style={{ marginTop: 6 }}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
