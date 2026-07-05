import { describe, expect, it } from "vitest";
import { formatPrice, slugify } from "@/lib/format";

describe("slugify", () => {
  it("retire les accents et normalise", () => {
    expect(slugify("Vert La Planète")).toBe("vert-la-planete");
    expect(slugify("Énergie & habitat")).toBe("energie-habitat");
    expect(slugify("Maraîcher·ère bio")).toBe("maraicher-ere-bio");
  });

  it("ne produit jamais de tirets en bord de chaîne", () => {
    expect(slugify("  --Bonjour!  ")).toBe("bonjour");
    expect(slugify("!!!")).toBe("");
  });
});

describe("formatPrice", () => {
  it("formate les centimes en euros français", () => {
    // Intl utilise des espaces insécables — on compare sans distinction d'espaces.
    expect(formatPrice(1490).replace(/\s/g, " ")).toContain("14,90");
    expect(formatPrice(0).replace(/\s/g, " ")).toContain("0,00");
    expect(formatPrice(11880).replace(/\s/g, " ")).toContain("118,80");
  });
});
