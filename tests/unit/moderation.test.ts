import { describe, expect, it } from "vitest";
import { checkContent, checkContentFields } from "@/lib/moderation";

describe("modération des contenus", () => {
  it("accepte un contenu normal", () => {
    expect(checkContent("Super producteur, légumes très frais et de saison !").ok).toBe(true);
  });

  it("refuse les insultes", () => {
    const r = checkContent("Quel connard ce vendeur");
    expect(r.ok).toBe(false);
  });

  it("ne bloque pas un mot légitime contenant une sous-chaîne", () => {
    // "salade" ne doit pas déclencher "salope", "pédale"/"pédé" -> mots entiers
    expect(checkContent("J'adore leur salade et leurs légumes").ok).toBe(true);
  });

  it("refuse le spam (arnaque)", () => {
    expect(checkContent("Gagnez de l'argent facile avec le trading crypto profit").ok).toBe(false);
  });

  it("refuse les liens en masse", () => {
    expect(checkContent("http://a.com http://b.com http://c.com achetez ici").ok).toBe(false);
  });

  it("refuse le tout-majuscules", () => {
    expect(checkContent("ACHETEZ MAINTENANT CE PRODUIT INCROYABLE TOUT DE SUITE").ok).toBe(false);
  });

  it("checkContentFields s'arrête au premier champ fautif", () => {
    const r = checkContentFields("Titre correct", "description avec pute dedans");
    expect(r.ok).toBe(false);
  });
});
