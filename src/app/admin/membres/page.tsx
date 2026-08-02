import { adminListUsers } from "@/lib/admin";
import { adminSetUserRole, adminDeleteUser } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/ConfirmButton";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export default async function AdminMembresPage() {
  const users = await adminListUsers();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Membres &amp; comptes</h1>
      </div>
      <p className="dash-page-date">{users.length} compte(s) enregistré(s)</p>

      <div className="table-card">
        <div className="table-card-hd">
          <span className="table-card-title">Comptes</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Membre</th>
              <th>Rôle</th>
              <th>Offre</th>
              <th>Inscrit le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="td-inner" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                    <strong>{u.name || "—"}</strong>
                    <span style={{ fontSize: "0.8em", color: "var(--muted, #6b7280)" }}>{u.email}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${u.role === "partenaire" ? "badge-amber" : "badge-eco"}`}>
                    {u.role === "partenaire" ? "Partenaire" : "Membre"}
                  </span>
                </td>
                <td>{u.offer || "—"}</td>
                <td>{fmt.format(u.createdAt)}</td>
                <td>
                  <div className="tbl-actions">
                    <form action={adminSetUserRole} style={{ display: "flex", gap: 6 }}>
                      <input type="hidden" name="id" value={u.id} />
                      <select name="role" defaultValue={u.role} className="form-select">
                        <option value="membre">Membre</option>
                        <option value="partenaire">Partenaire</option>
                      </select>
                      <button type="submit" className="tbl-action p">Appliquer</button>
                    </form>
                    <form action={adminDeleteUser}>
                      <input type="hidden" name="id" value={u.id} />
                      <ConfirmButton
                        message={`Supprimer le compte ${u.email} ? (RGPD, irréversible)`}
                        className="tbl-action danger"
                      >
                        Suppr.
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
