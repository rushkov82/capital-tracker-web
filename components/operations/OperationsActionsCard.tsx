"use client";

import OperationForm, {
  type OperationFormActionType,
} from "@/components/operations/OperationForm";

type OperationsActionsCardProps = {
  amount: string;
  setAmount: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  assetCategory: string;
  setAssetCategory: (value: string) => void;
  fromAssetCategory: string;
  setFromAssetCategory: (value: string) => void;
  toAssetCategory: string;
  setToAssetCategory: (value: string) => void;
  operationDate: string;
  setOperationDate: (value: string) => void;
  actionType: OperationFormActionType;
  setActionType: (value: OperationFormActionType) => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  availableCategories: string[];
};

export default function OperationsActionsCard({
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
  onSubmit,
  onCancelEdit,
  isEditing,
  availableCategories,
}: OperationsActionsCardProps) {
  const description = isEditing
    ? "Измените данные операции и сохраните"
    : "Добавьте операцию: пополнение, вывод или изменение стоимости";

  return (
    <section className="app-card h-full">
      <div className="flex h-full min-h-0 flex-col space-y-4">
        <div>
          <h2 className="app-card-title">
            {isEditing ? "Редактирование операции" : "Действия"}
          </h2>
          <div className="app-card-description">{description}</div>
        </div>

        <div className="min-h-0 flex-1">
          <OperationForm
            amount={amount}
            setAmount={setAmount}
            comment={comment}
            setComment={setComment}
            assetCategory={assetCategory}
            setAssetCategory={setAssetCategory}
            fromAssetCategory={fromAssetCategory}
            setFromAssetCategory={setFromAssetCategory}
            toAssetCategory={toAssetCategory}
            setToAssetCategory={setToAssetCategory}
            operationDate={operationDate}
            setOperationDate={setOperationDate}
            actionType={actionType}
            setActionType={setActionType}
            onSubmit={onSubmit}
            onCancel={onCancelEdit}
            showCancel={isEditing}
            submitLabel={isEditing ? "Сохранить изменения" : "Сохранить"}
            availableCategories={availableCategories}
          />
        </div>
      </div>
    </section>
  );
}
