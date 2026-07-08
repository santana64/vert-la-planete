"use client";

import { useState, useTransition } from "react";
import { openBillingPortalAction } from "@/app/actions/billing";

export function BillingPortalButton({ label }: { label: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function open() {
    setError(null);
    startTransition(async () => {
      const res = await openBillingPortalAction();
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      if (res.error) setError(res.error);
    });
  }

  return (
    <div>
      <button type="button" className="btn-sm-outline" onClick={open} disabled={pending}>
        {pending ? "Ouverture…" : label}
      </button>
      {error ? (
        <p style={{ fontSize: 12, color: "var(--pb)", fontWeight: 300, marginTop: 8, lineHeight: 1.5 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
