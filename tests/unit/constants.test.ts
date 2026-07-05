import { describe, expect, it } from "vitest";
import { COMPANY, FREE_PRODUCT_LIMIT, GRADIENTS, LAUNCH_PROMO, OFFERS } from "@/lib/constants";

/**
 * Ces tests verrouillent les valeurs CONTRACTUELLES (contrat de prestation V4,
 * art. 2.3) : toute modification accidentelle des prix ou des offres casse la CI.
 */
describe("offres contractuelles", () => {
  it("expose exactement les 3 offres du contrat", () => {
    expect(OFFERS.map((o) => o.key)).toEqual(["gratuit", "pro_mensuel", "pro_annuel"]);
  });

  it("Pro Mensuelle = 14,90 € / mois", () => {
    const pro = OFFERS.find((o) => o.key === "pro_mensuel")!;
    expect(pro.priceCents).toBe(1490);
    expect(pro.interval).toBe("month");
    expect(pro.stripeLookupKey).toBeTruthy();
  });

  it("Pro Annuelle = 118,80 € / an", () => {
    const pro = OFFERS.find((o) => o.key === "pro_annuel")!;
    expect(pro.priceCents).toBe(11880);
    expect(pro.interval).toBe("year");
    expect(pro.stripeLookupKey).toBeTruthy();
  });

  it("l'offre gratuite est vraiment gratuite et sans Stripe", () => {
    const free = OFFERS.find((o) => o.key === "gratuit")!;
    expect(free.priceCents).toBe(0);
    expect(free.stripeLookupKey).toBeNull();
  });

  it("la limite de produits de l'offre gratuite est cohérente", () => {
    expect(FREE_PRODUCT_LIMIT).toBeGreaterThan(0);
    expect(FREE_PRODUCT_LIMIT).toBeLessThan(100);
  });
});

describe("données société (pages légales)", () => {
  it("porte le SIREN/SIRET du contrat", () => {
    expect(COMPANY.siren).toBe("991 990 177");
    expect(COMPANY.siret).toBe("991 990 177 00016");
  });
});

describe("design tokens", () => {
  it("les dégradés sont des gradients CSS valides", () => {
    expect(GRADIENTS.length).toBeGreaterThan(0);
    for (const g of GRADIENTS) expect(g).toMatch(/^linear-gradient\(/);
  });

  it("la promo de lancement a un contenu affichable", () => {
    if (LAUNCH_PROMO.active) {
      expect(LAUNCH_PROMO.title.length).toBeGreaterThan(3);
      expect(LAUNCH_PROMO.detail.length).toBeGreaterThan(10);
    }
  });
});
