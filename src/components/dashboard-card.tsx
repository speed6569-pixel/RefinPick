type DashboardCardProps = {
  title: string;
  value: string;
  change?: string;
};

export function DashboardCard({ title, value, change }: DashboardCardProps) {
  return (
    <div className="metric-card">
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-950">{value}</p>
      {change ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="text-sm text-emerald-700">{change}</p>
        </div>
      ) : null}
    </div>
  );
}
