export function Swatch({
  token,
  role,
  className,
}: {
  token: string;
  role: string;
  className: string;
}) {
  return (
    <figure className="border-rule bg-paper border">
      <div className={`h-20 w-full ${className}`} aria-hidden />
      <figcaption className="border-rule border-t p-3">
        <p className="text-ink font-mono text-xs">{token}</p>
        <p className="text-ink-muted mt-1 text-xs text-pretty">{role}</p>
      </figcaption>
    </figure>
  );
}
