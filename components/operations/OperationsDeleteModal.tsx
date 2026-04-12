"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Operation } from "@/lib/operations";

type OperationsDeleteModalProps = {
  operation: Operation | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function OperationsDeleteModal({
  operation,
  onClose,
  onConfirm,
}: OperationsDeleteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!operation) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [operation, onClose]);

  if (!mounted || !operation) return null;

  const operationTitle =
    operation.comment?.trim() ||
    operation.asset_category ||
    "операцию без комментария";

  const modalNode = (
    <div
      className="fixed inset-0 z-[220] flex items-end justify-center bg-black/30 p-3 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[460px] rounded-[18px] border border-[var(--border)] bg-[var(--background)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <div className="app-card-title">Удалить операцию</div>
          <div className="app-text-small">
            Вы действительно хотите удалить{" "}
            <span className="text-[var(--text-primary)]">{operationTitle}</span>
            ?
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="app-button-secondary" onClick={onClose}>
            Отмена
          </button>

          <button
            className="app-button-secondary"
            style={{ color: "var(--danger)" }}
            onClick={onConfirm}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}
