export default function Loading() {
  return (
    <div className="page active" aria-busy="true" aria-label="Chargement de la page">
      <div className="section">
        <div className="skel-line h-sm w-40" style={{ marginBottom: 14 }} />
        <div className="skel-line h-xl w-60" style={{ marginBottom: 10 }} />
        <div className="skel-line w-80" style={{ marginBottom: 40 }} />
        <div className="skel-hero" />
        <div className="skel-cards-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skel-card">
              <div className="skel-card-img" />
              <div className="skel-card-body">
                <div className="skel-line w-80" />
                <div className="skel-line h-sm w-60" />
                <div className="skel-line h-sm w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
