"use client";

import OperationsActionsCard from "@/components/operations/OperationsActionsCard";
import OperationsSummaryCard from "@/components/operations/OperationsSummaryCard";
import OperationsListCard from "@/components/operations/OperationsListCard";
import OperationsOperationModal from "@/components/operations/OperationsOperationModal";
import OperationsDeleteModal from "@/components/operations/OperationsDeleteModal";
import type { Operation } from "@/lib/operations";
import type { OperationFormActionType } from "@/components/operations/OperationForm";

type OperationsScreenViewProps = {
  normalized: Operation[];
  filteredOperations: Operation[];
  availableCategories: string[];

  type: string;
  setType: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  period: string;
  setPeriod: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;

  editingOperationId: string | null;
  deleteTarget: Operation | null;

  amount: string;
  setAmount: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  assetCategory: string;
  setAssetCategory: (value: string) => void;
  operationDate: string;
  setOperationDate: (value: string) => void;
  actionType: OperationFormActionType;
  setActionType: (value: OperationFormActionType) => void;

  isEditDirty: boolean;

  onResetForm: () => void;
  onCloseOperationModal: () => void;
  onOpenEditModal: (operation: Operation) => void;
  onRequestDelete: (operation: Operation) => void;
  onSubmitOperation: () => Promise<void>;
  onQuickCreate: () => Promise<void>;
  onConfirmDelete: () => Promise<void>;
  onSetDeleteTarget: (operation: Operation | null) => void;
};

export default function OperationsScreenView({
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

  editingOperationId,
  deleteTarget,

  amount,
  setAmount,
  comment,
  setComment,
  assetCategory,
  setAssetCategory,
  operationDate,
  setOperationDate,
  actionType,
  setActionType,

  isEditDirty,

  onResetForm,
  onCloseOperationModal,
  onOpenEditModal,
  onRequestDelete,
  onSubmitOperation,
  onQuickCreate,
  onConfirmDelete,
  onSetDeleteTarget,
}: OperationsScreenViewProps) {
  return (
    <div className="space-y-4 xl:flex xl:h-[calc(100vh-160px)] xl:flex-col xl:space-y-4">
      <div>
        <h1 className="app-page-title">Операции</h1>
        <p className="app-page-subtitle">
          Добавляйте, просматривайте и управляйте всеми действиями с капиталом
        </p>
      </div>

      <div className="space-y-4 xl:grid xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)] xl:gap-4 xl:space-y-0">
        <div className="xl:min-h-0">
          <OperationsActionsCard
            amount={amount}
            setAmount={setAmount}
            comment={comment}
            setComment={setComment}
            assetCategory={assetCategory}
            setAssetCategory={setAssetCategory}
            operationDate={operationDate}
            setOperationDate={setOperationDate}
            actionType={actionType}
            setActionType={setActionType}
            onSubmit={onQuickCreate}
            onCancelEdit={onResetForm}
            isEditing={false}
            availableCategories={availableCategories}
          />
        </div>

        <div className="space-y-4 xl:flex xl:min-h-0 xl:flex-col xl:space-y-4">
          <OperationsSummaryCard operations={normalized} />

          <div className="xl:min-h-0 xl:flex-1">
            <OperationsListCard
              operations={filteredOperations}
              onOpen={onOpenEditModal}
              type={type}
              setType={setType}
              category={category}
              setCategory={setCategory}
              period={period}
              setPeriod={setPeriod}
              sort={sort}
              setSort={setSort}
            />
          </div>
        </div>
      </div>

      <OperationsOperationModal
        open={editingOperationId !== null}
        amount={amount}
        setAmount={setAmount}
        comment={comment}
        setComment={setComment}
        assetCategory={assetCategory}
        setAssetCategory={setAssetCategory}
        operationDate={operationDate}
        setOperationDate={setOperationDate}
        onClose={onCloseOperationModal}
        onSubmit={onSubmitOperation}
        onDelete={
          editingOperationId
            ? () => {
                const target = normalized.find(
                  (item) => item.id === editingOperationId
                );
                if (target) {
                  onRequestDelete(target);
                }
              }
            : undefined
        }
        availableCategories={availableCategories}
        saveDisabled={!isEditDirty}
      />

      <OperationsDeleteModal
        operation={deleteTarget}
        onClose={() => onSetDeleteTarget(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}