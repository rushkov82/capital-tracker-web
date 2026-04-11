"use client";

import StrategyScreenView from "@/components/strategy/StrategyScreenView";
import {
  getSaveStatusColor,
  getSaveStatusText,
  useStrategyController,
} from "@/components/strategy/useStrategyController";

export default function StrategyScreen() {
  const controller = useStrategyController();

  if (controller.isLoading || !controller.plan) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="app-page-title">Стратегия</h1>
          <p className="app-page-subtitle">
            Как ты планируешь накапливать капитал и распределять деньги
          </p>
        </div>

        <section className="app-card">
          <div className="app-text-small">Загружаем стратегию...</div>
        </section>
      </div>
    );
  }

  if (!controller.result?.success) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="app-page-title">Стратегия</h1>
          <p className="app-page-subtitle">
            Как ты планируешь накапливать капитал и распределять деньги
          </p>
        </div>

        <section className="app-card">
          <div className="app-text-small">
            Не удалось посчитать результат стратегии
          </div>
        </section>
      </div>
    );
  }

  return (
    <StrategyScreenView
      plan={controller.plan}
      isLoading={controller.isLoading}
      appliedDistributionMode={controller.appliedDistributionMode}
      saveStatusText={getSaveStatusText(controller.saveStatus)}
      saveStatusColor={getSaveStatusColor(controller.saveStatus)}
      showFloatingSummary={controller.showFloatingSummary}
      result={controller.result}
      compositionItems={controller.compositionItems}
      desktopResultCardRef={controller.desktopResultCardRef}
      mobileResultCardRef={controller.mobileResultCardRef}
      onChangePlan={controller.handlePlanChange}
      onApplyDistribution={controller.handleApplyDistribution}
    />
  );
}