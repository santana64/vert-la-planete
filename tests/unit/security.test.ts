import { describe, expect, it } from "vitest";
import { jsonLd } from "@/lib/jsonld";

describe("jsonLd — anti-XSS dans les balises <script>", () => {
  it("neutralise une tentative d'évasion de balise via un nom d'utilisateur", () => {
    const malicious = {
      "@type": "LocalBusiness",
      name: '</script><script>alert(document.cookie)</script>'
    };
    const out = jsonLd(malicious);
    // Aucune séquence pouvant fermer/ouvrir une balise ne doit subsister
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
    expect(out).not.toContain("</script");
    // Reste du JSON valide qui retrouve la valeur d'origine une fois parsé
    const parsed = JSON.parse(out) as { name: string };
    expect(parsed.name).toBe(malicious.name);
  });

  it("échappe aussi les esperluettes", () => {
    expect(jsonLd({ v: "a & b" })).not.toContain("&");
    expect((JSON.parse(jsonLd({ v: "a & b" })) as { v: string }).v).toBe("a & b");
  });
});

describe("redirect next= — anti open-redirect", () => {
  // Réplique exacte de la garde de loginAction.
  const isSafe = (next: string) => /^\/(?![/\\])/.test(next);

  it("accepte les chemins internes", () => {
    expect(isSafe("/compte")).toBe(true);
    expect(isSafe("/offres?bienvenue=1")).toBe(true);
    expect(isSafe("/")).toBe(true);
  });

  it("rejette les redirections externes déguisées", () => {
    expect(isSafe("//evil.com")).toBe(false);
    expect(isSafe("/\\evil.com")).toBe(false);
    expect(isSafe("https://evil.com")).toBe(false);
    expect(isSafe("javascript:alert(1)")).toBe(false);
  });
});
