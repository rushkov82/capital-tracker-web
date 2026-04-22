"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createTransfer,
  createOperation,
  deleteOperation,
  updateOperation,
  type Operation,
} from "@/lib/operations";
import {
  createDemoOperation,
  deleteDemoOperation,
  updateDemoOperation,
} from "@/lib/demo-storage";
import { normalizeOperations } from "@/lib/operations-helpers";
import { normalizeAssetCategory } from "@/lib/constants";
import { showToast } from "@/lib/toast";
import type { OperationFormActionType } from "@/components/operations/OperationForm";
import { useCoreData } from "@/components/core/CoreDataProvider";

type EditSnapshot = {
  amount: string;
  comment: string;
  assetCategory: string;
  operationDate: string;
};

export function useOperationsController() {
  const {
    operations,
    refreshOperations,
    isLoading,
    storageMode,
  } = useCoreData();

  const [mounted, setMounted] = useState(false);

  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState("new");

  const [editingOperationId, setEditingOperationId] = useState<string | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<Operation | null>(null);

  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [fromAssetCategory, setFromAssetCategory] = useState("");
  const [toAssetCategory, setToAssetCategory] = useState("");
  const [operationDate, setOperationDate] = useState("");
  const [actionType, setActionType] =
    useState<OperationFormActionType>("income");

  const [editSnapshot, setEditSnapshot] = useState<EditSnapshot | null>(null);

  useEffect(() => {
    setMounted(true);
    setOperationDate(new Date().toISOString().slice(0, 10));
  }, []);

  const normalized = useMemo(() => normalizeOperations(operations), [operations]);

  const currentEditingOperation = useMemo(() => {
    if (!editingOperationId) return null;
    return normalized.find((item) => item.id === editingOperationId) || null;
  }, [normalized, editingOperationId]);

  function getSignedAmount(input: {
    type: OperationFormActionType;
    amount: number;
  }) {
    if (input.type === "expense") return -Math.abs(input.amount);
    if (input.type === "adjustment") return input.amount;
    return Math.abs(input.amount);
  }

  const categoryBalances = useMemo(() => {
    const map: Record<string, number> = {};

    for (const operation of normalized) {
      const normalizedCategory = normalizeAssetCategory(
        operation.asset_category
      );
      if (!normalizedCategory) continue;

      map[normalizedCategory] =
        (map[normalizedCategory] || 0) +
        getSignedAmount({
          type: operation.type,
          amount: operation.amount,
        });
    }

    return map;
  }, [normalized]);

  const availableCategories = useMemo(() => {
    return Object.entries(categoryBalances)
      .filter(([, value]) => value > 0)
      .map(([normalizedCategory]) => normalizedCategory)
      .sort((a, b) => a.localeCompare(b, "ru"));
  }, [categoryBalances]);

  const filteredOperations = useMemo(() => {
    let result = [...normalized];

    if (type !== "all") {
      result = result.filter((operation) => operation.type === type);
    }

    if (category !== "all") {
      result = result.filter(
        (operation) => (operation.asset_category || "") === category
      );
    }

    if (period === "month") {
      const now = new Date();
      result = result.filter((operation) => {
        const date = new Date(operation.operation_date);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });
    }

    if (period === "year") {
      const now = new Date();
      result = result.filter((operation) => {
        const date = new Date(operation.operation_date);
        return date.getFullYear() === now.getFullYear();
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.operation_date).getTime();
      const dateB = new Date(b.operation_date).getTime();
      return sort === "new" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [normalized, type, category, period, sort]);

  function resetForm() {
    setAmount("");
    setComment("");
    setAssetCategory("");
    setFromAssetCategory("");
    setToAssetCategory("");
    setOperationDate(new Date().toISOString().slice(0, 10));
    setActionType("income");
  }

  function resetEditState() {
    setEditingOperationId(null);
    setEditSnapshot(null);
  }

  function closeOperationModal() {
    resetEditState();
  }

  function openEditModal(operation: Operation) {
    const nextAssetCategory =
      normalizeAssetCategory(operation.asset_category) || "";

    setEditingOperationId(operation.id);
    setAmount(String(operation.amount));
    setComment(operation.comment ?? "");
    setAssetCategory(nextAssetCategory);
    setOperationDate(operation.operation_date);
    setEditSnapshot({
      amount: String(operation.amount),
      comment: operation.comment ?? "",
      assetCategory: nextAssetCategory,
      operationDate: operation.operation_date,
    });
  }

  function handleDeleteRequest(operation: Operation) {
    setDeleteTarget(operation);
  }

  function validateBase(rawValue: number) {
    if (!rawValue || Number.isNaN(rawValue)) {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Введите корректную сумму",
      });
      return false;
    }

    if (comment.trim().length > 50) {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Комментарий не должен быть длиннее 50 символов",
      });
      return false;
    }

    return true;
  }

  function validateCategory(required: boolean, categories: string[]) {
    if (!required) return true;

    if (!assetCategory) {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Выберите существующую категорию",
      });
      return false;
    }

    if (!categories.includes(assetCategory)) {
      showToast({
        type: "error",
        title: "Ошибка",
        description:
          "Эта категория сейчас пуста, из неё нельзя выводить или переоценивать",
      });
      return false;
    }

    return true;
  }

  function validateMoveCategories() {
    if (!fromAssetCategory) {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Выберите исходную категорию",
      });
      return false;
    }

    if (!toAssetCategory) {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Выберите целевую категорию",
      });
      return false;
    }

    if (fromAssetCategory === toAssetCategory) {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Категории перемещения должны отличаться",
      });
      return false;
    }

    if (!availableCategories.includes(fromAssetCategory)) {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Исходная категория сейчас пуста",
      });
      return false;
    }

    return true;
  }

  function getEditBaseBalance(nextCategory: string) {
    const currentBalance = categoryBalances[nextCategory] || 0;

    if (!currentEditingOperation) {
      return currentBalance;
    }

    const currentCategory = normalizeAssetCategory(
      currentEditingOperation.asset_category
    );

    if (currentCategory !== nextCategory) {
      return currentBalance;
    }

    return (
      currentBalance -
      getSignedAmount({
        type: currentEditingOperation.type,
        amount: currentEditingOperation.amount,
      })
    );
  }

  const isEditDirty = useMemo(() => {
    if (!editSnapshot) return false;

    return (
      amount !== editSnapshot.amount ||
      comment !== editSnapshot.comment ||
      assetCategory !== editSnapshot.assetCategory ||
      operationDate !== editSnapshot.operationDate
    );
  }, [editSnapshot, amount, comment, assetCategory, operationDate]);

  async function handleQuickCreate() {
    const rawValue = Number(amount);
    if (!validateBase(rawValue)) return;

    const createType = actionType;

    if (createType === "move") {
      if (!validateMoveCategories()) return;

      const normalizedAmount = Math.abs(rawValue);
      const sourceBalance = categoryBalances[fromAssetCategory] || 0;

      if (sourceBalance - normalizedAmount < 0) {
        showToast({
          type: "error",
          title: "Ошибка",
          description:
            "В выбранной исходной категории недостаточно средств для перемещения",
        });
        return;
      }

      if (storageMode === "local") {
        showToast({
          type: "error",
          title: "Недоступно",
          description:
            "Перемещение пока доступно только для авторизованного режима",
        });
        return;
      }

      try {
        await createTransfer({
          amount: normalizedAmount,
          comment: comment.trim() || null,
          operation_date: operationDate,
          from_asset_category: fromAssetCategory,
          to_asset_category: toAssetCategory,
        });

        showToast({
          type: "success",
          title: "Сохранено",
          description: "Перемещение добавлено",
        });

        resetForm();
        await refreshOperations();
      } catch {
        showToast({
          type: "error",
          title: "Ошибка",
          description: "Не удалось сохранить перемещение",
        });
      }

      return;
    }

    const normalizedAmount =
      createType === "adjustment" ? rawValue : Math.abs(rawValue);
    const signedAmount = getSignedAmount({
      type: createType,
      amount: normalizedAmount,
    });

    const requiresExistingCategory = createType !== "income";
    if (!validateCategory(requiresExistingCategory, availableCategories)) return;

    if (requiresExistingCategory && assetCategory) {
      const baseBalance = categoryBalances[assetCategory] || 0;
      if (baseBalance + signedAmount < 0) {
        showToast({
          type: "error",
          title: "Ошибка",
          description:
            "В выбранной категории недостаточно средств для такой операции",
        });
        return;
      }
    }

    try {
      if (storageMode === "local") {
        createDemoOperation({
          amount: normalizedAmount,
          comment: comment.trim() || null,
          operation_date: operationDate,
          asset_category: assetCategory || null,
          type: createType,
        });
      } else {
        await createOperation({
          amount: normalizedAmount,
          comment: comment.trim() || null,
          operation_date: operationDate,
          asset_category: assetCategory || null,
          type: createType,
        });
      }

      if (storageMode !== "local") {
        showToast({
          type: "success",
          title: "Сохранено",
          description: "Операция добавлена",
        });
      }

      resetForm();
      await refreshOperations();
    } catch {
      if (storageMode === "local") {
        return;
      }

      showToast({
        type: "error",
        title: "Ошибка",
        description: "Не удалось сохранить операцию",
      });
    }
  }

  async function handleSubmitOperation() {
    if (!currentEditingOperation) return;

    const rawValue = Number(amount);
    if (!validateBase(rawValue)) return;

    const editType = currentEditingOperation.type;
    const normalizedAmount =
      editType === "adjustment" ? rawValue : Math.abs(rawValue);
    const signedAmount = getSignedAmount({
      type: editType,
      amount: normalizedAmount,
    });

    const requiresExistingCategory = editType !== "income";
    if (!validateCategory(requiresExistingCategory, availableCategories)) return;

    if (requiresExistingCategory && assetCategory) {
      const baseBalance = getEditBaseBalance(assetCategory);
      if (baseBalance + signedAmount < 0) {
        showToast({
          type: "error",
          title: "Ошибка",
          description:
            "В выбранной категории недостаточно средств для такой операции",
        });
        return;
      }
    }

    try {
      if (storageMode === "local") {
        updateDemoOperation(currentEditingOperation.id, {
          amount: normalizedAmount,
          comment: comment.trim() || null,
          operation_date: operationDate,
          asset_category: assetCategory || null,
          type: editType,
        });
      } else {
        await updateOperation(currentEditingOperation.id, {
          amount: normalizedAmount,
          comment: comment.trim() || null,
          operation_date: operationDate,
          asset_category: assetCategory || null,
          type: editType,
        });
      }

      if (storageMode !== "local") {
        showToast({
          type: "success",
          title: "Сохранено",
          description: "Операция обновлена",
        });
      }

      setEditSnapshot({
        amount: String(normalizedAmount),
        comment: comment.trim(),
        assetCategory: assetCategory || "",
        operationDate,
      });

      await refreshOperations();
    } catch {
      if (storageMode === "local") {
        return;
      }

      showToast({
        type: "error",
        title: "Ошибка",
        description: "Не удалось обновить операцию",
      });
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      if (storageMode === "local") {
        deleteDemoOperation(deleteTarget.id);
      } else {
        await deleteOperation(deleteTarget.id);
      }

      if (storageMode !== "local") {
        showToast({
          type: "success",
          title: "Удалено",
          description: "Операция удалена",
        });
      }

      if (editingOperationId === deleteTarget.id) {
        closeOperationModal();
      }

      setDeleteTarget(null);
      await refreshOperations();
    } catch {
      if (storageMode === "local") {
        return;
      }

      showToast({
        type: "error",
        title: "Ошибка",
        description: "Не удалось удалить операцию",
      });
    }
  }

  return {
    mounted,
    isLoading,

    normalized,
    filteredOperations,
    availableCategories,

    type,
    setType,
    category,
    setCategory,
    period,
    setPeriod,
    sort,
    setSort,

    modalMode: editingOperationId ? "edit" : null,
    editingOperationId,
    deleteTarget,

    amount,
    setAmount,
    comment,
    setComment,
    assetCategory,
    setAssetCategory,
    fromAssetCategory,
    setFromAssetCategory,
    toAssetCategory,
    setToAssetCategory,
    operationDate,
    setOperationDate,
    actionType,
    setActionType,

    isEditDirty,

    resetForm,
    closeOperationModal,
    openEditModal,
    handleDeleteRequest,
    handleSubmitOperation,
    handleQuickCreate,
    handleConfirmDelete,

    setDeleteTarget,
  };
}
