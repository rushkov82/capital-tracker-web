import { formatNumber } from "@/lib/calculations";

type CapitalHeaderCardProps = {
  totalCapital: number;
};

export default function CapitalHeaderCard({
  totalCapital,
}: CapitalHeaderCardProps) {
  return (
    <section className="app-card">
      <div className="app-text-small mb-2">Текущий капитал</div>
      <div className="text-[32px] leading-[36px] font-semibold">
        {formatNumber(totalCapital)} ₽
      </div>
    </section>
  );
}