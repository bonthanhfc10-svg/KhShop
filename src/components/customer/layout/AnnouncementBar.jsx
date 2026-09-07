import { Truck } from 'lucide-react';

const messages = [
  'FREE SHIPPING ON ORDERS OVER $50',
  'NEW SEASON DROPS LIVE NOW',
];

export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white">
      <div className="container-kh flex items-center justify-center gap-2 py-2.5">
        <Truck size={14} className="text-neutral-300" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
          {messages[0]}
        </p>
      </div>
    </div>
  );
}
