import { Fragment } from "react";

/**
 * Restitue un texte saisi dans un simple <textarea> (articles, offres d'emploi)
 * en respectant la mise en forme que l'auteur a tapée :
 *   - une ligne vide  → nouveau paragraphe
 *   - un retour simple → saut de ligne à l'intérieur du paragraphe
 *
 * HTML ignore par défaut les retours à la ligne isolés (ils valent un espace) :
 * sans ce composant, seuls les doubles retours produisaient un effet visible,
 * ce qui donnait l'impression que la mise en forme « ne s'appliquait pas ».
 */
export function FormattedText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={className}>
          {paragraph.split("\n").map((line, j, lines) => (
            <Fragment key={j}>
              {line}
              {j < lines.length - 1 ? <br /> : null}
            </Fragment>
          ))}
        </p>
      ))}
    </>
  );
}
