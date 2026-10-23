export function WorldHeading({
  eyebrow,
  children,
  subtitle,
}: {
  eyebrow: string;
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="world-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{children}</h1>
      {subtitle && <p className="world-subtitle">{subtitle}</p>}
    </header>
  );
}
