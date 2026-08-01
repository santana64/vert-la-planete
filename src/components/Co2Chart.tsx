import { unstable_cache } from "next/cache";

/**
 * Co2Chart — intensité carbone de l'électricité française sur 24 h.
 *
 * 100 % ÉCO-CONÇU / 0 TRACKING :
 *  - Le fetch a lieu UNIQUEMENT côté serveur (React Server Component async),
 *    puis est mémorisé 1 h via `unstable_cache`. La page d'accueil étant
 *    `force-dynamic`, c'est ce wrapper qui garantit un seul appel réseau serveur
 *    par heure, partagé entre tous les visiteurs.
 *  - Le navigateur ne reçoit QUE du HTML + un SVG inline : aucune librairie de
 *    chart, aucun `<script>` tiers, aucune requête réseau côté client, aucune iframe.
 *  - Robustesse : fetch < 2 points exploitables ou toute exception ⇒ `null`
 *    (section masquée) → l'accueil ne casse jamais.
 *
 * Base : « aire dégradée » + badge de niveau + tendance 24 h + axe éditorial.
 */

// L'horodatage est conservé en string ISO (et non en Date) : `unstable_cache`
// sérialise son retour, un objet Date reviendrait en string et casserait le formatage.
type Point = { t: string; v: number };

const SOURCE_RTE =
  "https://www.rte-france.com/donnees-publications/eco2mix-donnees-temps-reel/emissions-co2-par-kwh-produit-france";

const API_URL =
  "https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/eco2mix-national-tr/records" +
  "?select=date_heure,taux_co2&where=taux_co2%20IS%20NOT%20NULL" +
  "&order_by=date_heure%20DESC&limit=96";

/** 96 derniers points (24 h au pas de 15 min), en ordre chronologique croissant. */
async function fetchCo2Series(): Promise<Point[]> {
  const res = await fetch(API_URL, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(6000)
  });
  if (!res.ok) return [];

  const json: unknown = await res.json();
  const results =
    json && typeof json === "object" && Array.isArray((json as { results?: unknown }).results)
      ? ((json as { results: unknown[] }).results as unknown[])
      : [];

  const points: Point[] = [];
  for (const row of results) {
    if (!row || typeof row !== "object") continue;
    const { date_heure, taux_co2 } = row as { date_heure?: unknown; taux_co2?: unknown };
    if (typeof date_heure !== "string" || typeof taux_co2 !== "number") continue;
    if (!Number.isFinite(taux_co2)) continue;
    if (Number.isNaN(new Date(date_heure).getTime())) continue;
    points.push({ t: date_heure, v: taux_co2 });
  }
  // Les horodatages ISO (UTC, même format) se trient chronologiquement en lexicographique.
  points.sort((a, b) => (a.t < b.t ? -1 : a.t > b.t ? 1 : 0));
  return points;
}

/** Cache serveur 1 h, indépendant du `force-dynamic` de la page d'accueil. */
const getCo2Series = unstable_cache(fetchCo2Series, ["co2-eco2mix-24h"], { revalidate: 3600 });

// --- Géométrie (unités viewBox) ----------------------------------------------
const W = 760;
const H = 240;
const PAD_L = 10;
const PAD_R = 52;
const PAD_T = 30;
const PAD_B = 26;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Courbe lissée (spline cardinal) → attribut `d`. */
function smoothLine(pts: [number, number][]): string {
  if (pts.length < 2) return pts.length ? `M ${r2(pts[0][0])} ${r2(pts[0][1])}` : "";
  const t = 0.16;
  const d = [`M ${r2(pts[0][0])} ${r2(pts[0][1])}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) * t;
    const c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t;
    const c2y = p2[1] - (p3[1] - p1[1]) * t;
    d.push(`C ${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2[0])} ${r2(p2[1])}`);
  }
  return d.join(" ");
}

/** Niveau pédagogique selon gCO₂/kWh (typique France : 15–80). */
function levelFor(v: number): { key: "faible" | "modere" | "eleve"; label: string } {
  if (v < 40) return { key: "faible", label: "Très faible" };
  if (v <= 80) return { key: "modere", label: "Modéré" };
  return { key: "eleve", label: "Élevé" };
}

const fmtHeure = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris"
});

export async function Co2Chart() {
  let series: Point[] = [];
  try {
    series = await getCo2Series();
  } catch {
    series = [];
  }
  if (series.length < 2) return null;

  const values = series.map((p) => p.v);
  const n = series.length;
  const dataMin = Math.round(Math.min(...values));
  const dataMax = Math.round(Math.max(...values));
  const last = series[n - 1];
  const current = Math.round(last.v);
  const lv = levelFor(current);

  const delta = Math.round(current - series[0].v);
  const trend =
    delta > 2
      ? { arrow: "↗", word: "en hausse" }
      : delta < -2
        ? { arrow: "↘", word: "en baisse" }
        : { arrow: "→", word: "stable" };
  const deltaLabel = `${delta > 0 ? "+" : ""}${delta} g/kWh`;

  const span = Math.max(...values) - Math.min(...values) || 4;
  const domMin = Math.max(0, Math.min(...values) - span * 0.25 - 1);
  const domMax = Math.max(...values) + span * 0.3 + 1;
  const domSpan = domMax - domMin || 1;

  const x = (i: number) => PAD_L + (i / (n - 1)) * INNER_W;
  const y = (v: number) => PAD_T + (1 - (v - domMin) / domSpan) * INNER_H;

  const coords: [number, number][] = series.map((p, i) => [x(i), y(p.v)]);
  const linePath = smoothLine(coords);
  const baseline = PAD_T + INNER_H;
  const areaPath = `${linePath} L ${r2(x(n - 1))} ${r2(baseline)} L ${r2(x(0))} ${r2(baseline)} Z`;

  const idxMin = values.indexOf(Math.min(...values));
  const idxMax = values.indexOf(Math.max(...values));
  const endX = x(n - 1);
  const endY = y(last.v);

  const heure = fmtHeure.format(new Date(last.t));
  const ariaLabel =
    `Intensité carbone de l'électricité en France sur les dernières 24 heures. ` +
    `Valeur actuelle à ${heure} : ${current} grammes de CO₂ par kilowattheure, niveau ${lv.label.toLowerCase()}. ` +
    `Minimum ${dataMin}, maximum ${dataMax} sur la période, tendance ${trend.word}.`;

  const gridYs = [0, 0.5, 1].map((f) => PAD_T + f * INNER_H);

  return (
    <section className="co2chart" id="electricite" aria-labelledby="co2chart-title">
      <div className="co2chart-inner">
        <header className="co2chart-head">
          <div>
            <p className="co2chart-kicker">
              <span className="co2chart-dot" aria-hidden />
              Éco-conçu · 0 tracking
            </p>
            <h2 id="co2chart-title" className="co2chart-title">
              Intensité carbone de l&apos;électricité <em>en France</em>
            </h2>
            <p className="co2chart-sub">Dernières 24 h · pas de 15 min · source RTE (éCO2mix)</p>
          </div>
          <div className="co2chart-now">
            <div className="co2chart-now-val">
              {current}
              <span className="co2chart-now-unit">gCO₂/kWh · électricité France</span>
            </div>
            <div className="co2chart-now-time">à {heure}</div>
            <div className="co2chart-now-meta">
              <span className={`co2chart-badge co2chart-badge--${lv.key}`}>{lv.label}</span>
              <span className="co2chart-trend">
                <span aria-hidden>{trend.arrow}</span> {trend.word} sur 24 h ({deltaLabel})
              </span>
            </div>
          </div>
        </header>

        <svg
          className="co2chart-svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            <linearGradient id="co2chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3daa62" stopOpacity="0.34" />
              <stop offset="55%" stopColor="#3daa62" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3daa62" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridYs.map((gy, i) => (
            <line key={i} x1={PAD_L} y1={r2(gy)} x2={W - PAD_R} y2={r2(gy)} className="co2chart-grid" />
          ))}

          <path d={areaPath} className="co2chart-area" />
          <path d={linePath} className="co2chart-stroke" />

          <circle cx={r2(x(idxMax))} cy={r2(y(values[idxMax]))} r="2.5" className="co2chart-mm-dot" />
          <text x={r2(x(idxMax))} y={r2(y(values[idxMax]) - 8)} className="co2chart-mm-lbl" textAnchor="middle">
            max {dataMax}
          </text>
          <circle cx={r2(x(idxMin))} cy={r2(y(values[idxMin]))} r="2.5" className="co2chart-mm-dot" />
          <text x={r2(x(idxMin))} y={r2(y(values[idxMin]) + 14)} className="co2chart-mm-lbl" textAnchor="middle">
            min {dataMin}
          </text>

          <line x1={r2(endX)} y1={r2(endY)} x2={r2(endX)} y2={r2(baseline)} className="co2chart-end-guide" />
          <circle cx={r2(endX)} cy={r2(endY)} r="6" className="co2chart-end-halo" />
          <circle cx={r2(endX)} cy={r2(endY)} r="3.4" className="co2chart-end-dot" />
        </svg>

        <div className="co2chart-axis" aria-hidden>
          <span>il y a 24 h</span>
          <span className="co2chart-axis-arrow" />
          <span>maintenant</span>
        </div>

        <footer className="co2chart-foot">
          <p className="co2chart-legend">
            Plus la valeur est basse, plus l&apos;électricité consommée est décarbonée.
          </p>
          <a className="co2chart-src" href={SOURCE_RTE} target="_blank" rel="noreferrer">
            Comprendre la donnée ↗
          </a>
        </footer>
      </div>
    </section>
  );
}
