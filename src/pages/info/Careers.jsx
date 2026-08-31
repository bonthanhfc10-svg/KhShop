import { Mail } from 'lucide-react';
import InfoPage from '../../components/info/InfoPage';

const ROLES = [
  'Senior Product Designer',
  'Front-End Engineer',
  'Growth & E-commerce Manager',
  'Supply Chain Coordinator',
];

export default function Careers() {
  return (
    <InfoPage
      title="Careers at KhShop"
      crumb="Careers"
      intro="Join a team obsessed with movement, craft and community. We're always looking for builders who care about the details."
    >
      <h2 className="heading-display text-2xl">Open Roles</h2>
      <div className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {ROLES.map((r) => (
          <div
            key={r}
            className="flex items-center justify-between gap-4 py-5"
          >
            <span className="font-display text-base font-bold text-neutral-900">
              {r}
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Remote / Hybrid
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-neutral-600">
        <Mail size={16} className="text-neutral-400" />
        Don't see your role? Send your CV to careers@khshop.com
      </p>
    </InfoPage>
  );
}
