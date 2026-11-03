"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function ToastNotification() {
  const { toastMessage, toastType } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastType === "success";
  const isWarning = toastType === "warning";

  return (
    <div className="fixed bottom-6 right-6 z-50 pop-in flex items-center gap-3 px-4 py-3 rounded-xl card-surface shadow-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] max-w-sm">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isSuccess
            ? "bg-[var(--accent-soft)] text-[var(--accent-hover)]"
            : isWarning
            ? "bg-[var(--warning-soft)] text-[var(--warning)]"
            : "bg-[var(--primary-soft)] text-[var(--primary)]"
        }`}
      >
        <i
          className={`bi ${
            isSuccess
              ? "bi-check-circle-fill text-lg text-[var(--success)]"
              : isWarning
              ? "bi-exclamation-triangle-fill text-base"
              : "bi-info-circle-fill text-base"
          }`}
        />
      </div>
      <p className="text-xs font-semibold text-[var(--text-main)] leading-snug">
        {toastMessage}
      </p>
    </div>
  );
}
