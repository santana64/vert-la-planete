"use client";

/** Bouton de soumission (dans un <form>) qui demande confirmation avant d'agir.
 *  Utilisé pour les actions destructives de l'admin (suppressions). */
export function ConfirmButton({
  children,
  message = "Confirmer cette action ?",
  className = "tbl-action danger"
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
