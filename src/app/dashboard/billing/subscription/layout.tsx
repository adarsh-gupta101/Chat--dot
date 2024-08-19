export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col divide-y divide-surface-100 rounded-lg border border-surface-100 px-4 py-2.5 text-sm shadow-wg-xs">
      {children}
    </div>
  );
}
