import { DotList } from "@/components/visual/parts";

/**
 * What Trafficomm handles, as a compact table on the dark system section.
 *
 * Replaces the eight-card Capabilities grid on the pages whose visual system
 * already carries the process: the same terminology, one row per group,
 * always in the markup rather than behind an interaction.
 */
export function ScopeTable({ groups }: { groups: readonly { title: string; items: readonly string[] }[] }) {
  return (
    <div className="mt-12" data-reveal>
      <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-white">What Trafficomm handles</h3>
      <dl className="mt-5 divide-y divide-line-dark border-y border-line-dark">
        {groups.map((g) => (
          <div key={g.title} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <dt className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-fog">{g.title}</dt>
            <dd className="text-[0.95rem] text-white">
              <DotList items={g.items} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
