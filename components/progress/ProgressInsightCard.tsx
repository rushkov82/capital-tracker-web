type ProgressInsightCardProps = {
  deviation: number;
  currentMonthDifference: number;
  elapsedMonths: number;
};

export default function ProgressInsightCard({
  deviation,
  currentMonthDifference,
  elapsedMonths,
}: ProgressInsightCardProps) {
  const text = buildInsightText({
    deviation,
    currentMonthDifference,
    elapsedMonths,
  });

  return (
    <section className="app-card">
      <div className="space-y-3">
        <h2 className="app-card-title">Вывод</h2>
        <div className="app-text-secondary leading-relaxed">{text}</div>
      </div>
    </section>
  );
}

function buildInsightText({
  deviation,
  currentMonthDifference,
  elapsedMonths,
}: {
  deviation: number;
  currentMonthDifference: number;
  elapsedMonths: number;
}) {
  if (elapsedMonths === 0) {
    return "План только начался. Сейчас главное — зафиксировать старт и начать первое движение по системе.";
  }

  if (deviation >= 0 && currentMonthDifference >= 0) {
    return "Сейчас ты держишь темп и по общему плану, и по текущему месяцу. Это именно тот режим, в котором система начинает работать на тебя.";
  }

  if (deviation >= 0 && currentMonthDifference < 0) {
    return "По общему плану ты пока идёшь нормально, но в этом месяце начал отставать. Это не критично, но именно такие месяцы потом съедают общий темп.";
  }

  if (deviation < 0 && currentMonthDifference >= 0) {
    return "В этом месяце ты двигаешься правильно, но по общей дистанции пока отстаёшь. Значит, нужно не просто хорошо прожить один месяц, а несколько месяцев подряд держать темп.";
  }

  return "Сейчас ты отстаёшь и по общему плану, и по текущему месяцу. Это неприятно, но зато честно: система показывает не ощущения, а реальную картину.";
}