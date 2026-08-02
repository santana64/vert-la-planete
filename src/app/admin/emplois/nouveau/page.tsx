import { AdminJobForm } from "@/components/AdminJobForm";

export default function NewJobPage() {
  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Nouvelle offre</h1>
      </div>
      <AdminJobForm />
    </>
  );
}
