type CurrentCapitalCardProps = {
  totalFactAmount: number;
  formatNumber: (value: number) => string;
};

export default function CurrentCapitalCard({
  totalFactAmount,
  formatNumber,
}: CurrentCapitalCardProps) {
  return (
    <section className="app-card">
      <div className="app-text-small mb-2">Текущий капитал</div>
      <div
        className="text-[32px] leading-[36px] font-semibold"
        style={{ color: totalFactAmount < 0 ? "#dc2626" : "var(--accent)" }}
      >
        {formatNumber(totalFactAmount)} ₽
      </div>
    </section>
  );
}