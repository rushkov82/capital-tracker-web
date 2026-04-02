export default function StrategyInfoCard() {
  return (
    <section className="app-card md:col-span-7">
      <div className="space-y-2">
        <div className="app-card-title">
          Это просто план, не обязательство
        </div>

        <div className="app-text-small">Здесь ты задаёшь направление:</div>

        <div className="app-text-small">
          — сколько будешь откладывать
          <br />— как будет расти взнос
          <br />— на какой срок
          <br />— как будут распределяться деньги
        </div>

        <div className="app-text-small">
          👉 Можно вводить примерно — потом всё скорректируешь
        </div>
      </div>
    </section>
  );
}