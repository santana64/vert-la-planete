import { adminListMessages } from "@/lib/admin";
import { adminDeleteMessage } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/ConfirmButton";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export default async function AdminMessagesPage() {
  const messages = await adminListMessages();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Messages de contact</h1>
      </div>

      {messages.length === 0 ? (
        <p>Aucun message.</p>
      ) : (
        messages.map((m) => (
          <div key={m.id} className="table-card" style={{ marginBottom: 16 }}>
            <div className="table-card-hd">
              <div>
                <div className="table-card-title">
                  {m.firstName} {m.lastName}
                </div>
                <div className="dash-page-date">
                  {m.profile} · {fmt.format(m.createdAt)}
                </div>
              </div>
              <a className="table-card-link" href={`mailto:${m.email}`}>
                Répondre ↗
              </a>
            </div>

            <p
              style={{
                padding: "14px 20px",
                whiteSpace: "pre-wrap",
                color: "var(--st)",
              }}
            >
              {m.message}
            </p>

            <div style={{ padding: "0 20px 16px" }}>
              <form action={adminDeleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton
                  message="Supprimer ce message ?"
                  className="tbl-action danger"
                >
                  Supprimer
                </ConfirmButton>
              </form>
            </div>
          </div>
        ))
      )}
    </>
  );
}
