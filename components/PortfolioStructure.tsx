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

export default function PortfolioStructure(props: PortfolioStructureProps) {
  const {
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
  } = props;

  const isOverflow = totalShare > 100;

  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-4">Структура портфеля</h2>

      <div className="space-y-3">
        <MobileRow name="Акции/облигации" share={stocksBondsShare} setShare={setStocksBondsShare} rate={stocksBondsReturn} setRate={setStocksBondsReturn} input={commonInputClass} />
        <MobileRow name="Кэш в рублях" share={rubCashShare} setShare={setRubCashShare} rate={rubCashReturn} setRate={setRubCashReturn} input={commonInputClass} />
        <MobileRow name="Драгметаллы" share={metalsShare} setShare={setMetalsShare} rate={metalsReturn} setRate={setMetalsReturn} input={commonInputClass} />
        <MobileRow name="Недвижимость" share={realEstateShare} setShare={setRealEstateShare} rate={realEstateReturn} setRate={setRealEstateReturn} input={commonInputClass} />
        <MobileRow name="Валюта" share={currencyShare} setShare={setCurrencyShare} rate={currencyReturn} setRate={setCurrencyReturn} input={commonInputClass} />

        <MobileRow
          name="Прочее"
          share={Math.max(otherShare, 0).toFixed(1)}
          setShare={() => {}}
          rate={otherReturn}
          setRate={setOtherReturn}
          input={commonInputClass}
          readonly
        />
      </div>

      <div className="app-divider my-4" />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="app-label">Сумма долей</span>
          <span className={isOverflow ? "app-error-text" : "app-text"}>
            {totalShare.toFixed(1)} %
          </span>
        </div>

        <div className="flex justify-between">
          <span className="app-label">Доходность портфеля</span>
          <span className="app-text">{portfolioResult}</span>
        </div>
      </div>
    </section>
  );
}

function MobileRow({ name, share, setShare, rate, setRate, input, readonly }: any) {
  return (
    <div className="app-list-row">
      <div className="app-text">{name}</div>

      <div className="flex gap-2 min-w-0">
        <input
          className={`${input} w-full ${readonly ? "app-input-readonly" : ""}`}
          value={share}
          onChange={(e) => setShare(e.target.value)}
          readOnly={readonly}
        />
        <input
          className={`${input} w-full`}
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </div>
    </div>
  );
}