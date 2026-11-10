export function TablePage({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">{title}</h1>
      <p className="mt-2 text-teal-900/70">{blurb}</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-teal-900/10 bg-white/70 p-4">
        {children}
      </div>
    </div>
  );
}
