/** Placeholder ligero para Suspense; reserva altura y no compite con el LCP del hero. */
export default function SectionFallback() {
  return (
    <div
      className="min-h-[28rem] w-full bg-brand-bg border-b-4 border-brand-bg"
      aria-hidden="true"
    />
  );
}
