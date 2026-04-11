type OverviewActionHintCardProps = {
  hintText: string;
};

export default function OverviewActionHintCard({
  hintText,
}: OverviewActionHintCardProps) {
  return (
    <section className="app-card">
      <div className="space-y-2">
        <div className="app-card-title">Что делать сейчас</div>
        <div className="app-text-secondary leading-relaxed">{hintText}</div>
      </div>
    </section>
  );
}