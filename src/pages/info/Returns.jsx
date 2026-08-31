import InfoPage from '../../components/info/InfoPage';

const STEPS = [
  'Start a return from your account within 30 days of delivery.',
  'Create a return label — it will include a prepaid shipping option.',
  'Pack the item securely in its original packaging with tags attached.',
  'Drop your parcel at the nearest pickup point and we handle the rest.',
];

export default function Returns() {
  return (
    <InfoPage
      title="Returns & Exchanges"
      crumb="Returns"
      intro="Not quite right? No problem. You have 30 days to return or exchange any unworn item with tags attached."
    >
      <ol className="space-y-4">
        {STEPS.map((s, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-neutral-900 text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="pt-1.5 text-[15px] leading-relaxed text-neutral-700">
              {s}
            </p>
          </li>
        ))}
      </ol>

      <h2 className="heading-display mt-12 text-2xl">Refunds</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">
        Once we receive and inspect your return, your refund is processed
        within 5–7 business days to your original payment method. You'll
        receive an email to confirm.
      </p>
    </InfoPage>
  );
}
