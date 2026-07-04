import Link from "next/link";

/**
 * Stylised illustrated map (decorative) reproduced from the template hero.
 * The whole block links to the partners directory (/partenaires).
 */
export function HeroMap({ actorCount }: { actorCount: number }) {
  return (
    <Link href="/partenaires" className="hero-map-wrap" style={{ display: "block" }}>
      <div className="map-osm">
        <div className="map-grid-l" />
        <div className="map-park" style={{ top: "12%", left: "8%", width: "22%", height: "20%" }} />
        <div className="map-park" style={{ top: "60%", left: "52%", width: "18%", height: "15%" }} />
        <div className="map-water" style={{ top: "42%", left: "5%", width: "12%", height: "28%" }} />
        <div className="map-rd main" style={{ top: "33%", height: 3, left: 0, right: 0 }} />
        <div className="map-rd main" style={{ top: "61%", height: 3, left: 0, right: 0 }} />
        <div className="map-rd main" style={{ left: "41%", width: 3, top: 0, bottom: 0 }} />
        <div className="map-rd main" style={{ left: "68%", width: 3, top: 0, bottom: 0 }} />
        <div className="map-rd" style={{ top: "21%", height: 1.5, left: "20%", right: "25%", opacity: 0.7 }} />
        <div className="map-cluster" style={{ top: "19%", left: "17%", width: 30, height: 30, fontSize: 11 }}>4</div>
        {[
          { top: "33%", left: "41%", size: 13, color: "#3daa62", delay: "0s" },
          { top: "55%", left: "57%", size: 13, color: "#3daa62", delay: ".4s" },
          { top: "26%", left: "65%", size: 13, color: "#3daa62", delay: ".8s" },
          { top: "45%", left: "74%", size: 11, color: "#f0c040", delay: ".6s" },
          { top: "70%", left: "28%", size: 11, color: "#7ecb99", delay: ".2s" }
        ].map((p, i) => (
          <div key={i} className="pin-w" style={{ top: p.top, left: p.left }}>
            <div
              className="pin-c"
              style={{ width: p.size, height: p.size, background: p.color, animationDelay: p.delay }}
            />
            <div
              className="pin-r"
              style={{ position: "absolute", inset: -5, color: p.color, animationDelay: p.delay }}
            />
          </div>
        ))}
        <div className="map-ctrls">
          <span className="map-ctrl">+</span>
          <span className="map-ctrl">−</span>
        </div>
        <div className="map-tip">
          <div className="map-tip-n">Maxime — Maraîcher bio</div>
          <div className="map-tip-s">Producteur local · Val de Loire</div>
          <div style={{ marginTop: 7 }}>
            <span className="badge badge-eco">Certifié AB</span>
          </div>
        </div>
        <div className="map-leg">
          <div className="map-leg-item">
            <div className="map-leg-dot" style={{ background: "#3daa62" }} />
            Producteurs & artisans
          </div>
          <div className="map-leg-item">
            <div className="map-leg-dot" style={{ background: "#7ecb99" }} />
            Marques engagées
          </div>
          <div className="map-leg-item">
            <div className="map-leg-dot" style={{ background: "#f0c040" }} />
            Points de retrait
          </div>
        </div>
      </div>
      <div className="map-bar">
        <span className="map-bar-txt">
          <strong>{actorCount} vendeurs écologiques</strong> près de chez vous
        </span>
        <span className="btn-primary" style={{ fontSize: 12, padding: "8px 18px", borderRadius: 8 }}>
          Ouvrir →
        </span>
      </div>
    </Link>
  );
}
