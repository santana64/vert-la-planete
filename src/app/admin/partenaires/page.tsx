import Link from "next/link";
import { adminListSellers } from "@/lib/admin";
import {
  adminToggleSellerVerified,
  adminSetSellerOffer,
  adminDeleteSeller
} from "@/app/actions/admin";
import { ConfirmButton } from "@/components/ConfirmButton";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

function offerBadge(offer: string): { className: string; label: string } {
  if (offer === "gratuit") return { className: "badge badge-eco", label: "Gratuit" };
  if (offer === "pro_mensuel") return { className: "badge badge-amber", label: "Pro mensuel" };
  if (offer === "pro_annuel") return { className: "badge badge-amber", label: "Pro annuel" };
  return { className: "badge", label: offer };
}

export default async function AdminPartenairesPage() {
  const sellers = await adminListSellers();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Partenaires ({sellers.length})</h1>
      </div>

      <div className="table-card">
        <div className="table-card-hd">
          <span className="table-card-title">Tous les partenaires</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Partenaire</th>
              <th>Catégorie · Ville</th>
              <th>Offre</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => {
              const badge = offerBadge(s.offer);
              return (
                <tr key={s.id}>
                  <td>
                    <div className="td-inner">
                      <span
                        className="td-logo"
                        style={{ background: s.gradient }}
                      >
                        {s.logoInitials}
                      </span>
                      <div>
                        <div>{s.name}</div>
                        {s.ownerEmail && (
                          <div style={{ fontSize: 12, opacity: 0.6 }}>{s.ownerEmail}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {s.category} · {s.city}
                  </td>
                  <td>
                    <span className={badge.className}>{badge.label}</span>
                  </td>
                  <td>
                    {s.verified ? (
                      <span className="status-badge s-active">Vérifié</span>
                    ) : (
                      <span className="status-badge s-pending">À vérifier</span>
                    )}
                  </td>
                  <td>{fmt.format(s.createdAt)}</td>
                  <td>
                    <div className="tbl-actions">
                      <form action={adminToggleSellerVerified}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="verified" value={String(s.verified)} />
                        <button type="submit" className="tbl-action">
                          {s.verified ? "Retirer" : "Vérifier"}
                        </button>
                      </form>

                      <form action={adminSetSellerOffer} style={{ display: "flex", gap: 6 }}>
                        <input type="hidden" name="id" value={s.id} />
                        <select name="offer" defaultValue={s.offer} className="form-select">
                          <option value="gratuit">Gratuit</option>
                          <option value="pro_mensuel">Pro mensuel</option>
                          <option value="pro_annuel">Pro annuel</option>
                        </select>
                        <button type="submit" className="tbl-action p">
                          Appliquer
                        </button>
                      </form>

                      <Link href={`/partenaires/${s.slug}`} className="tbl-action">
                        Voir
                      </Link>

                      <form action={adminDeleteSeller}>
                        <input type="hidden" name="id" value={s.id} />
                        <ConfirmButton message={`Supprimer ${s.name} ?`}>
                          Suppr.
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
