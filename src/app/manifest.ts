import type { MetadataRoute } from "next";

/** Manifeste PWA — le site est installable et se comporte comme une application. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vert La Planète",
    short_name: "Vert La Planète",
    description:
      "Le réseau des acteurs de la transition écologique : partenaires engagés, points de collecte, initiatives urbaines et événements groupés — partout en France.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fcf9",
    theme_color: "#1a7671",
    lang: "fr",
    categories: ["lifestyle", "shopping", "social"],
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ]
  };
}
