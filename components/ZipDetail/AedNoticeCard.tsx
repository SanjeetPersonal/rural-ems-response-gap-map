export function AedNoticeCard() {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Nearest AED
      </div>
      <p className="mt-1 text-sm text-slate-700">
        A nationwide AED (defibrillator) location dataset isn&apos;t available yet. In the
        meantime, AEDs are commonly found at:
      </p>
      <ul className="mt-2 text-sm text-slate-700 list-disc list-inside space-y-0.5">
        <li>Schools</li>
        <li>Banks</li>
        <li>Town halls / municipal buildings</li>
        <li>Gyms and community/rec centers</li>
      </ul>
    </div>
  );
}
