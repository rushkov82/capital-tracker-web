"use client";

import OperationsScreenView from "@/components/operations/OperationsScreenView";
import { useOperationsController } from "@/components/operations/useOperationsController";

export default function OperationsScreen() {
  const controller = useOperationsController();

  if (!controller.mounted) {
    return null;
  }

  if (controller.isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="app-page-title">Операции</h1>
          <p className="app-page-subtitle">
            Добавляйте, просматривайте и управляйте всеми действиями с капиталом
          </p>
        </div>

        <section className="app-card">
          <div className="app-text-small">Загружаем операции...</div>
        </section>
      </div>
    );
  }

  return (
    <OperationsScreenView
      normalized={controller.normalized}
      filteredOperations={controller.filteredOperations}
      availableCategories={controller.availableCategories}
      type={controller.type}
      setType={controller.setType}
      category={controller.category}
      setCategory={controller.setCategory}
      period={controller.period}
      setPeriod={controller.setPeriod}
      sort={controller.sort}
      setSort={controller.setSort}
      editingOperationId={controller.editingOperationId}
      deleteTarget={controller.deleteTarget}
      amount={controller.amount}
      setAmount={controller.setAmount}
      comment={controller.comment}
      setComment={controller.setComment}
      assetCategory={controller.assetCategory}
      setAssetCategory={controller.setAssetCategory}
      fromAssetCategory={controller.fromAssetCategory}
      setFromAssetCategory={controller.setFromAssetCategory}
      toAssetCategory={controller.toAssetCategory}
      setToAssetCategory={controller.setToAssetCategory}
      operationDate={controller.operationDate}
      setOperationDate={controller.setOperationDate}
      actionType={controller.actionType}
      setActionType={controller.setActionType}
      isEditDirty={controller.isEditDirty}
      onResetForm={controller.resetForm}
      onCloseOperationModal={controller.closeOperationModal}
      onOpenEditModal={controller.openEditModal}
      onRequestDelete={controller.handleDeleteRequest}
      onSubmitOperation={controller.handleSubmitOperation}
      onQuickCreate={controller.handleQuickCreate}
      onConfirmDelete={controller.handleConfirmDelete}
      onSetDeleteTarget={controller.setDeleteTarget}
    />
  );
}
