const merchantHighlights = [
  {
    title: 'Instant settlement insights',
    description:
      'Generate up-to-the-minute ledgers for every group so your team can focus on customer experience instead of manual reconciliations.',
  },
  {
    title: 'Custom branding and exports',
    description:
      'Deliver statements that look and feel like your brand with white-labelled PDFs and sharable live dashboards.',
  },
  {
    title: 'Enterprise-grade support',
    description:
      'Priority onboarding, quarterly optimisation reviews, and dedicated specialists who understand your workflow.',
  },
];

const MerchantPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 lg:max-w-6xl lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50 p-8 shadow-2xl shadow-slate-950/50 sm:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-ocean-500/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-blossom-500/30 blur-3xl" />
        </div>
        <div className="relative space-y-6 text-center sm:text-left">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ocean-100">
            Splitly+ for merchants
          </span>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Streamline settlements for your venues</h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Give your hospitality, events, or co-working teams the power of Splitly+ with real-time reconciliation, collaborative wallets, and effortless exports tailored to your brand.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="mailto:hello@splitly.plus"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-ocean-500 via-blossom-500 to-ocean-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-900/30 transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Talk to our team
            </a>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
              Response within 1 business day
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {merchantHighlights.map((highlight) => (
          <div key={highlight.title} className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-semibold text-white">{highlight.title}</h2>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">{highlight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantPage;
