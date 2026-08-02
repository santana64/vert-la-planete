import { notFound } from "next/navigation";
import { adminGetArticle } from "@/lib/admin";
import { AdminArticleForm } from "@/components/AdminArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await adminGetArticle(id);
  if (!a) notFound();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Modifier l&apos;article</h1>
      </div>

      <div className="table-card" style={{ padding: 24, maxWidth: 760 }}>
        <AdminArticleForm article={a} />
      </div>
    </>
  );
}
