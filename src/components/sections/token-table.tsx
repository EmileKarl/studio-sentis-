import { cn } from "@/lib/utils";

export function TokenTable({
  caption,
  rows,
}: {
  caption: string;
  rows: { name: string; value: string; note?: string }[];
}) {
  return (
    <div className="border-rule overflow-x-auto border">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-rule bg-surface-2 border-b">
            <th scope="col" className="text-ink-muted px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase">
              Token
            </th>
            <th scope="col" className="text-ink-muted px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase">
              Valeur
            </th>
            <th scope="col" className="text-ink-muted px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase">
              Usage
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.name}
              className={cn("border-rule border-b last:border-b-0", i % 2 ? "bg-surface-2/40" : "bg-paper")}
            >
              <td className="text-ink px-4 py-2.5 font-mono text-xs whitespace-nowrap">{row.name}</td>
              <td className="text-ink-secondary px-4 py-2.5 font-mono text-xs whitespace-nowrap tabular-nums">
                {row.value}
              </td>
              <td className="text-ink-secondary px-4 py-2.5 text-xs text-pretty">{row.note ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
