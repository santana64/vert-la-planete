import Link from "next/link";
import {
  getAdminStats,
  adminListMessages,
  adminListReviews,
} from "@/lib/admin";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export default async function AdminDashboardPage() {
  const [stats, messages, reviews] = await Promise.all([
    getAdminStats(),
    adminListMessages(),
    adminListReviews(),
  ]);

  const today = fmt.format(new Date());
  const lastMessages = messages.slice(0, 5);
  const lastReviews = reviews.slice(0, 5);

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Tableau de bord</h1>
      </div>
      <p className="dash-page-date">{today}</p>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-lbl">Partenaires</div>
          <div className="kpi-val">{stats.sellers}</div>
          <div className="kpi-trend">
            {stats.sellersVerified} vérifiés · {stats.sellersPro} Pro
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-lbl">Membres</div>
          <div className="kpi-val">{stats.users}</div>
          <div className="kpi-trend">
            {stats.members} membres · {stats.partners} partenaires
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-lbl">Avis</div>
          <div className="kpi-val">{stats.reviews}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-lbl">Lieux proposés</div>
          <div className="kpi-val">{stats.ecoPlaces}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-lbl">Messages</div>
          <div className="kpi-val">{stats.messages}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-lbl">Actualités</div>
          <div className="kpi-val">{stats.articles}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-lbl">Offres d&apos;emploi</div>
          <div className="kpi-val">{stats.jobs}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        <div className="table-card">
          <div className="table-card-hd">
            <span className="table-card-title">Derniers messages</span>
            <Link className="table-card-link" href="/admin/messages">
              Tout voir →
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Profil</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {lastMessages.length === 0 ? (
                <tr>
                  <td colSpan={3}>Aucun message.</td>
                </tr>
              ) : (
                lastMessages.map((m) => (
                  <tr key={m.id}>
                    <td>
                      {m.firstName} {m.lastName}
                    </td>
                    <td>{m.profile}</td>
                    <td>{fmt.format(m.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <div className="table-card-hd">
            <span className="table-card-title">Derniers avis</span>
            <Link className="table-card-link" href="/admin/avis">
              Tout voir →
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Partenaire</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {lastReviews.length === 0 ? (
                <tr>
                  <td colSpan={3}>Aucun avis.</td>
                </tr>
              ) : (
                lastReviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.sellerName ?? "—"}</td>
                    <td>{"★".repeat(r.rating)}</td>
                    <td>{fmt.format(r.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
