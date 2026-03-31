"use client";

import { useEffect, useMemo, useState } from "react";
import MainParameters from "@/components/MainParameters";
import PortfolioStructure from "@/components/PortfolioStructure";
import ResultBlock from "@/components/ResultBlock";
import { useStrategy } from "@/hooks/useStrategy";
import { formatNumber } from "@/lib/calculations";

type StrategyMode = "cash" | "balanced" | "manual";

export default function StrategyPage() {
  const s = useStrategy();
  const [mode, setMode] = useState<StrategyMode>("cash");

  useEffect(() => {
    if (mode === "cash") {
      s.setRubCashShare("100");
      s.setRubCashReturn("0");

      s.setStocksBondsShare("0");
      s.setStocksBondsReturn("0");

      s.setMetalsShare("0");
      s.setMetalsReturn("0");

      s.setRealEstateShare("0");
      s.setRealEstateReturn("0");

      s.setCurrencyShare("0");
      s.setCurrencyReturn("0");

      s.setOtherReturn("0");
    }

    if (mode === "balanced") {
      s.setRubCashShare("25");
      s.setRubCashReturn("8");

      s.setStocksBondsShare("60");
      s.setStocksBondsReturn("14");

      s.setMetalsShare("15");
      s.setMetalsReturn("5");

      s.setRealEstateShare("0");
      s.setRealEstateReturn("0");

      s.setCurrencyShare("0");
      s.setCurrencyReturn("0");

      s.setOtherReturn("0");
    }
  }, [mode]);

  const baseCapital = useMemo(() => {
    const value = Number(s.initialCapital || 0);
    return Number.isNaN(value) ? 0 : value;
  }, [s.initialCapital]);

  const cashOnlyAmount = baseCapital;

  const balancedCashAmount = Math.round(baseCapital * 0.25);
  const balancedStocksAmount = Math.round(baseCapital * 0.6);
  const balancedMetalsAmount = Math.round(baseCapital * 0.15);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="app-page-title">Стратегия</h1>
          <p className="app-page-subtitle">
            Сценарий роста капитала, структура и ориентир по результату
          </p>
        </div>

        {s.saveStatus !== "idle" && (
          <div
            className="text-[13px] leading-[18px] whitespace-nowrap pt-1"
            style={{ color: s.getSaveStatusColor() }}
          >
            {s.getSaveStatusText()}
          </div>
        )}
      </div>

      {s.errorText && <div className="app-error-box">{s.errorText}</div>}

      <MainParameters
        cardClass="app-card"
        commonInputClass="app-input"
        initialCapital={s.initialCapital}
        setInitialCapital={s.setInitialCapital}
        monthlyContribution={s.monthlyContribution}
        setMonthlyContribution={s.setMonthlyContribution}
        inflation={s.inflation}
        setInflation={s.setInflation}
        contributionGrowth={s.contributionGrowth}
        setContributionGrowth={s.setContributionGrowth}
        years={s.years}
        setYears={s.setYears}
        planStartDate={s.planStartDate}
        setPlanStartDate={s.setPlanStartDate}
      />

      <section className="app-card">
        <div className="app-card-title mb-4">Способ распределения капитала</div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => setMode("cash")}
            className="rounded-[14px] border px-4 py-3 text-left transition-colors"
            style={{
              borderColor: mode === "cash" ? "var(--accent)" : "var(--border)",
              background:
                mode === "cash" ? "rgba(59,130,246,0.08)" : "transparent",
            }}
          >
            <div className="font-medium">Только Cash</div>
            <div className="app-text-small mt-1">
              Простой режим без сложной структуры
            </div>
          </button>

          <button
            onClick={() => setMode("balanced")}
            className="rounded-[14px] border px-4 py-3 text-left transition-colors"
            style={{
              borderColor:
                mode === "balanced" ? "var(--accent)" : "var(--border)",
              background:
                mode === "balanced"
                  ? "rgba(59,130,246,0.08)"
                  : "transparent",
            }}
          >
            <div className="font-medium">Сбалансированный</div>
            <div className="app-text-small mt-1">
              Cash, акции и металлы в готовой пропорции
            </div>
          </button>

          <button
            onClick={() => setMode("manual")}
            className="rounded-[14px] border px-4 py-3 text-left transition-colors"
            style={{
              borderColor:
                mode === "manual" ? "var(--accent)" : "var(--border)",
              background:
                mode === "manual"
                  ? "rgba(59,130,246,0.08)"
                  : "transparent",
            }}
          >
            <div className="font-medium">Настроить самому</div>
            <div className="app-text-small mt-1">
              Ручная настройка структуры и доходности
            </div>
          </button>
        </div>
      </section>

      {mode === "cash" && (
        <section className="app-card">
          <div className="app-card-title mb-3">Состав портфеля</div>
          <div className="space-y-2 text-[14px]">
            <div>Cash — {formatNumber(cashOnlyAmount)} ₽ (100%)</div>
          </div>
        </section>
      )}

      {mode === "balanced" && (
        <section className="app-card">
          <div className="app-card-title mb-3">Состав портфеля</div>
          <div className="space-y-2 text-[14px]">
            <div>Cash — {formatNumber(balancedCashAmount)} ₽ (25%)</div>
            <div>Акции — {formatNumber(balancedStocksAmount)} ₽ (60%)</div>
            <div>Металлы — {formatNumber(balancedMetalsAmount)} ₽ (15%)</div>
          </div>
        </section>
      )}

      {mode === "manual" && (
        <PortfolioStructure
          cardClass="app-card"
          commonInputClass="app-input"
          stocksBondsShare={s.stocksBondsShare}
          setStocksBondsShare={s.setStocksBondsShare}
          stocksBondsReturn={s.stocksBondsReturn}
          setStocksBondsReturn={s.setStocksBondsReturn}
          rubCashShare={s.rubCashShare}
          setRubCashShare={s.setRubCashShare}
          rubCashReturn={s.rubCashReturn}
          setRubCashReturn={s.setRubCashReturn}
          metalsShare={s.metalsShare}
          setMetalsShare={s.setMetalsShare}
          metalsReturn={s.metalsReturn}
          setMetalsReturn={s.setMetalsReturn}
          realEstateShare={s.realEstateShare}
          setRealEstateShare={s.setRealEstateShare}
          realEstateReturn={s.realEstateReturn}
          setRealEstateReturn={s.setRealEstateReturn}
          currencyShare={s.currencyShare}
          setCurrencyShare={s.setCurrencyShare}
          currencyReturn={s.currencyReturn}
          setCurrencyReturn={s.setCurrencyReturn}
          otherShare={s.otherShare}
          otherReturn={s.otherReturn}
          setOtherReturn={s.setOtherReturn}
          totalShare={s.totalManualShare + Math.max(s.otherShare, 0)}
          portfolioResult={s.portfolioResult}
        />
      )}

      <ResultBlock
        cardClass="app-card"
        nominalResult={s.nominalResult}
        realResult={s.realResult}
        errorText=""
      />
    </div>
  );
}