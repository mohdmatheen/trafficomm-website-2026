import type { ArticleBlock } from "@/data/types";
import { ArticleChart } from "./ArticleChart";

/** Renders structured article blocks. A CMS adapter maps rich text into these blocks. */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose-tc">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h2":
            return (
              <h2 key={i} id={b.id} className="scroll-mt-28">
                {b.text}
              </h2>
            );
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="!my-10 border-l-2 border-signal pl-6">
                <p className="text-[1.5rem] leading-snug tracking-[-0.02em] text-ink">&ldquo;{b.text}&rdquo;</p>
                {b.cite && <footer className="eyebrow mt-4 text-steel">— {b.cite}</footer>}
              </blockquote>
            );
          case "callout":
            return (
              <aside key={i} className="!my-8 rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-line">
                <p className="eyebrow text-signal-ink">{b.title}</p>
                <p className="mt-3 text-[0.98rem] leading-relaxed">{b.text}</p>
              </aside>
            );
          case "chart":
            return <ArticleChart key={i} chart={b} />;
          case "table":
            return (
              <div key={i} className="!my-10 overflow-x-auto rounded-[var(--radius-card)] ring-1 ring-line">
                <table className="w-full min-w-[520px] border-collapse bg-white text-left text-[0.92rem]">
                  <caption className="border-b border-line bg-paper px-5 py-3 text-left font-mono text-[0.7rem] uppercase tracking-[0.1em] text-steel">
                    {b.caption}
                  </caption>
                  <thead>
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} scope="col" className="border-b border-line px-5 py-3 font-medium text-ink">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r[0]} className="border-b border-line last:border-0">
                        {r.map((c, k) =>
                          k === 0 ? (
                            <th key={k} scope="row" className="px-5 py-3 font-medium text-ink">
                              {c}
                            </th>
                          ) : (
                            <td key={k} className="px-5 py-3 text-steel">
                              {c}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
