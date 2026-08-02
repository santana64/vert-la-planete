import { adminListEcoPlaces } from "@/lib/admin";
import { adminDeleteEcoPlace } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/ConfirmButton";
import type { EcoPlace } from "@/db/schema";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const KIND_LABELS: Record<EcoPlace["kind"], string> = {
  ramassage: "Événement/ramassage",
  dechetterie: "Point de collecte",
  centre: "Initiative urbaine"
};

function truncate(text: string, max = 100): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export default async function AdminEcoPlacesPage() {
  const places = await adminListEcoPlaces();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Lieux proposés</h1>
      </div>
      <p className="dash-page-date">{places.length} lieux</p>

      <div className="table-card">
        <div className="table-card-hd">
          <span className="table-card-title">Tous les lieux</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Nom</th>
              <th>Ville</th>
              <th>Info</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id}>
                <td>
                  <span className="badge badge-blue">
                    {KIND_LABELS[place.kind]}
                  </span>
                </td>
                <td>
                  <div className="td-inner" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                    <strong>{place.name}</strong>
                    <span style={{ color: "var(--muted, #6b7280)", fontSize: 13 }}>
                      {truncate(place.description)}
                    </span>
                  </div>
                </td>
                <td>{place.city}</td>
                <td>{place.schedule ?? "—"}</td>
                <td>{fmt.format(place.createdAt)}</td>
                <td>
                  <div className="tbl-actions">
                    <form action={adminDeleteEcoPlace}>
                      <input type="hidden" name="id" value={place.id} />
                      <ConfirmButton
                        message="Supprimer ce lieu ?"
                        className="tbl-action danger"
                      >
                        Suppr.
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {places.length === 0 && (
              <tr>
                <td colSpan={6}>Aucun lieu proposé pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
