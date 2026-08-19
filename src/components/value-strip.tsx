import { portfolio } from "@/data/portfolio";

export function ValueStrip() {
  return (
    <section className="value-wrap" aria-label="Core development capabilities">
      <div className="value-strip shell">
        {portfolio.values.map((item) => (
          <article key={item.number}><span>{item.number}</span><div><h2>{item.title}</h2><p>{item.text}</p></div></article>
        ))}
      </div>
    </section>
  );
}
