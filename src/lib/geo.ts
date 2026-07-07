/** Coordonnées des principales villes françaises (positionnement par défaut). */
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Paris: { lat: 48.8566, lng: 2.3522 },
  Lyon: { lat: 45.7578, lng: 4.832 },
  Marseille: { lat: 43.2965, lng: 5.3698 },
  Toulouse: { lat: 43.6047, lng: 1.4442 },
  Nice: { lat: 43.7102, lng: 7.262 },
  Nantes: { lat: 47.2184, lng: -1.5536 },
  Montpellier: { lat: 43.6108, lng: 3.8767 },
  Strasbourg: { lat: 48.5734, lng: 7.7521 },
  Bordeaux: { lat: 44.8378, lng: -0.5792 },
  Lille: { lat: 50.6292, lng: 3.0573 },
  Rennes: { lat: 48.1173, lng: -1.6778 },
  Tours: { lat: 47.3941, lng: 0.6848 },
  Grenoble: { lat: 45.1885, lng: 5.7245 },
  Dijon: { lat: 47.322, lng: 5.0415 },
  Angers: { lat: 47.4784, lng: -0.5632 }
};

/** Centre de la France métropolitaine (vue par défaut de la carte). */
export const FRANCE_CENTER = { lat: 46.6, lng: 2.4 };

export function coordsForCity(city: string): { lat: number; lng: number } | null {
  const norm = city.trim().toLowerCase();
  for (const [name, coords] of Object.entries(CITY_COORDS)) {
    if (name.toLowerCase() === norm) return coords;
  }
  return null;
}
