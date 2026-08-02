import { AdminArticleForm } from "@/components/AdminArticleForm";

export default function NewArticlePage() {
  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Nouvel article</h1>
      </div>

      <div className="table-card" style={{ padding: 24, maxWidth: 760 }}>
        <AdminArticleForm />
      </div>
    </>
  );
}
