import { notFound } from "next/navigation";
import { adminGetJob } from "@/lib/admin";
import { AdminJobForm } from "@/components/AdminJobForm";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const j = await adminGetJob(id);
  if (!j) notFound();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Modifier l&apos;offre</h1>
      </div>
      <AdminJobForm job={j} />
    </>
  );
}
