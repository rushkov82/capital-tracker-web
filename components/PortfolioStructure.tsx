type PortfolioStructureProps = {
  cardClass: string;
  commonInputClass: string;

  stocksBondsShare: string;
  setStocksBondsShare: (value: string) => void;
  stocksBondsReturn: string;
  setStocksBondsReturn: (value: string) => void;

  rubCashShare: string;
  setRubCashShare: (value: string) => void;
  rubCashReturn: string;
  setRubCashReturn: (value: string) => void;

  metalsShare: string;
  setMetalsShare: (value: string) => void;
  metalsReturn: string;
  setMetalsReturn: (value: string) => void;

  realEstateShare: string;
  setRealEstateShare: (value: string) => void;
  realEstateReturn: string;
  setRealEstateReturn: (value: string) => void;

  currencyShare: string;
  setCurrencyShare: (value: string) => void;
  currencyReturn: string;
  setCurrencyReturn: (value: string) => void;

  otherShare: number;
  otherReturn: string;
  setOtherReturn: (value: string) => void;

  totalShare: number;
  portfolioResult: string;
};

export default function PortfolioStructure({
  cardClass,
  commonInputClass,
  stocksBondsShare,
  setStocksBondsShare,
  stocksBondsReturn,
  setStocksBondsReturn,
  rubCashShare,
  setRubCashShare,
  rubCashReturn,
  setRubCashReturn,
  metalsShare,
  setMetalsShare,
  metalsReturn,
  setMetalsReturn,
  realEstateShare,
  setRealEstateShare,
  realEstateReturn,
  setRealEstateReturn,
  currencyShare,
  setCurrencyShare,
  currencyReturn,
  setCurrencyReturn,
  otherShare,
  otherReturn,
  setOtherReturn,
  totalShare,
  portfolioResult,
}: PortfolioStructureProps) {
  const isOverflow = totalShare > 100;

  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-4">Структура портфеля</h2>

      <div className="mb-3 grid grid-cols-[150px_1fr_1fr] gap-4">
        <div />
        <div className="app-text-small">Доля %</div>
        <div className="app-text-small">Доходность %</div>
      </div>

      <div className="space-y-3">
        <PortfolioRow
          name="Акции/облигации"
          share={stocksBondsShare}
          onShareChange={setStocksBondsShare}
          rate={stocksBondsReturn}
          onRateChange={setStocksBondsReturn}
          inputClass={commonInputClass}
        />
        <PortfolioRow
          name="Кэш в рублях"
          share={rubCashShare}
          onShareChange={setRubCashShare}
          rate={rubCashReturn}
          onRateChange={setRubCashReturn}
          inputClass={commonInputClass}
        />
        <PortfolioRow
          name="Драгметаллы"
          share={metalsShare}
          onShareChange={setMetalsShare}
          rate={metalsReturn}
          onRateChange={setMetalsReturn}
          inputClass={commonInputClass}
        />
        <PortfolioRow
          name="Недвижимость"
          share={realEstateShare}
          onShareChange={setRealEstateShare}
          rate={realEstateReturn}
          onRateChange={setRealEstateReturn}
          inputClass={commonInputClass}
        />
        <PortfolioRow
          name="Валюта"
          share={currencyShare}
          onShareChange={setCurrencyShare}
          rate={currencyReturn}
          onRateChange={setCurrencyReturn}
          inputClass={commonInputClass}
        />
        <AutoShareRow
          name="Прочее"
          share={otherShare}
          rate={otherReturn}
          onRateChange={setOtherReturn}
          inputClass={commonInputClass}
        />
      </div>

      <div className="app-divider my-4" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="app-label">Сумма долей</span>
          <span className={isOverflow ? "app-error-text" : "app-text"}>
            {totalShare.toFixed(1)} %
          </span>
        </div>

        {isOverflow && (
          <div className="app-error-text">Сумма долей превышает 100%</div>
        )}

        <div className="flex items-center justify-between">
          <span className="app-label">Доходность портфеля</span>
          <span className="app-text">{portfolioResult}</span>
        </div>
      </div>
    </section>
  );
}

function PortfolioRow({
  name,
  share,
  onShareChange,
  rate,
  onRateChange,
  inputClass,
}: {
  name: string;
  share: string;
  onShareChange: (value: string) => void;
  rate: string;
  onRateChange: (value: string) => void;
  inputClass: string;
}) {
  return (
    <div className="app-form-grid-wide">
      <div className="app-label">{name}</div>
      <input
        className={inputClass}
        value={share}
        onChange={(e) => onShareChange(e.target.value)}
      />
      <input
        className={inputClass}
        value={rate}
        onChange={(e) => onRateChange(e.target.value)}
      />
    </div>
  );
}

function AutoShareRow({
  name,
  share,
  rate,
  onRateChange,
  inputClass,
}: {
  name: string;
  share: number;
  rate: string;
  onRateChange: (value: string) => void;
  inputClass: string;
}) {
  const displayShare = share < 0 ? 0 : share;

  return (
    <div className="app-form-grid-wide">
      <div className="app-label">{name}</div>
      <input
        className={`${inputClass} app-input-readonly`}
        value={displayShare.toFixed(1)}
        readOnly
        tabIndex={-1}
      />
      <input
        className={inputClass}
        value={rate}
        onChange={(e) => onRateChange(e.target.value)}
      />
    </div>
  );
}