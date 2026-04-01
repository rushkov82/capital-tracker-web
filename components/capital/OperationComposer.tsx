import type { AssetCategory } from "@/lib/constants";
import ContributionForm from "@/components/ContributionForm";
import AdjustmentForm from "@/components/AdjustmentForm";

type OperationComposerProps = {
  categories: AssetCategory[];
  actualContribution: string;
  setActualContribution: (value: string) => void;
  contributionCategory: string;
  setContributionCategory: (value: string) => void;
  contributionDate: string;
  setContributionDate: (value: string) => void;
  contributionComment: string;
  setContributionComment: (value: string) => void;
  operationType: "income" | "expense";
  setOperationType: (value: "income" | "expense") => void;
  onSaveContribution: () => void;
  adjustmentAmount: string;
  setAdjustmentAmount: (value: string) => void;
  adjustmentCategory: string;
  setAdjustmentCategory: (value: string) => void;
  adjustmentDate: string;
  setAdjustmentDate: (value: string) => void;
  adjustmentComment: string;
  setAdjustmentComment: (value: string) => void;
  onSaveAdjustment: () => void;
};

export default function OperationComposer({
  categories,
  actualContribution,
  setActualContribution,
  contributionCategory,
  setContributionCategory,
  contributionDate,
  setContributionDate,
  contributionComment,
  setContributionComment,
  operationType,
  setOperationType,
  onSaveContribution,
  adjustmentAmount,
  setAdjustmentAmount,
  adjustmentCategory,
  setAdjustmentCategory,
  adjustmentDate,
  setAdjustmentDate,
  adjustmentComment,
  setAdjustmentComment,
  onSaveAdjustment,
}: OperationComposerProps) {
  return (
    <section className="app-card">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="app-card-title">Добавить операцию</h2>
          <div className="app-text-small mt-1">
            Пополнение, вывод или переоценка активов
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ContributionForm
          cardClass=""
          commonInputClass="app-input"
          selectClass="app-select"
          categories={[...categories]}
          actualContribution={actualContribution}
          setActualContribution={setActualContribution}
          contributionCategory={contributionCategory}
          setContributionCategory={setContributionCategory}
          contributionDate={contributionDate}
          setContributionDate={setContributionDate}
          contributionComment={contributionComment}
          setContributionComment={setContributionComment}
          operationType={operationType}
          setOperationType={setOperationType}
          onSave={onSaveContribution}
        />

        <AdjustmentForm
          cardClass=""
          commonInputClass="app-input"
          selectClass="app-select"
          categories={[...categories]}
          amount={adjustmentAmount}
          setAmount={setAdjustmentAmount}
          category={adjustmentCategory}
          setCategory={setAdjustmentCategory}
          date={adjustmentDate}
          setDate={setAdjustmentDate}
          comment={adjustmentComment}
          setComment={setAdjustmentComment}
          onSave={onSaveAdjustment}
        />
      </div>
    </section>
  );
}