export default function StrategyInfoBar() {
  return (
    <section className="app-card py-3 px-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="font-semibold">
          Это просто план, не обязательство
        </div>

        <div className="app-text-small flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>— сколько будешь откладывать</span>
          <span>— как будет расти взнос</span>
          <span>— на какой срок</span>
          <span>— как будут распределяться деньги</span>
          <span className="text-yellow-400">
            👉 можно вводить примерно — потом всё скорректируешь
          </span>
        </div>
      </div>
    </section>
  );
}