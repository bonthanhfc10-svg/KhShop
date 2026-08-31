import InfoPage from '../../components/info/InfoPage';

const CLOTHING = [
  { size: 'XS', body: '33–35"', chest: '32–35"', waist: '25–28"' },
  { size: 'S', body: '36–38"', chest: '36–39"', waist: '29–32"' },
  { size: 'M', body: '39–41"', chest: '40–43"', waist: '33–36"' },
  { size: 'L', body: '42–44"', chest: '44–47"', waist: '37–40"' },
  { size: 'XL', body: '45–48"', chest: '48–51"', waist: '41–44"' },
  { size: 'XXL', body: '49–52"', chest: '52–55"', waist: '45–48"' },
];

const SHOES = [
  { size: '6', us: '6', uk: '5.5', eu: '39', cm: '24.4' },
  { size: '7', us: '7', uk: '6.5', eu: '40', cm: '25.0' },
  { size: '8', us: '8', uk: '7.5', eu: '41', cm: '25.6' },
  { size: '9', us: '9', uk: '8.5', eu: '42', cm: '26.3' },
  { size: '10', us: '10', uk: '9.5', eu: '43', cm: '27.0' },
  { size: '11', us: '11', uk: '10.5', eu: '44', cm: '27.6' },
  { size: '12', us: '12', uk: '11.5', eu: '45', cm: '28.3' },
];

function Table({ head, rows }) {
  return (
    <div className="overflow-hidden border border-neutral-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-neutral-50 text-xs font-bold uppercase tracking-widest text-neutral-600">
            {head.map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-neutral-100">
              {Object.values(r).map((v, i) => (
                <td
                  key={i}
                  className={`px-4 py-3 ${i === 0 ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuide() {
  return (
    <InfoPage
      title="Size Guide"
      crumb="Size Guide"
      intro="Measurements are body measurements taken in inches (clothing) and centimetres (shoes). If you're between sizes, we recommend sizing up for a relaxed fit."
    >
      <h2 className="heading-display text-2xl">Clothing</h2>
      <p className="mb-4 mt-2 text-sm text-neutral-500">
        Body height, chest and waist measurements.
      </p>
      <Table
        head={['Size', 'Height', 'Chest', 'Waist']}
        rows={CLOTHING.map((r) => [r.size, r.body, r.chest, r.waist])}
      />

      <h2 className="heading-display mt-14 text-2xl">Footwear</h2>
      <p className="mb-4 mt-2 text-sm text-neutral-500">
        US, UK, EU and foot length in centimetres.
      </p>
      <Table
        head={['Size', 'US', 'UK', 'EU', 'Foot (cm)']}
        rows={SHOES.map((r) => [r.size, r.us, r.uk, r.eu, r.cm])}
      />

      <h2 className="heading-display mt-14 text-2xl">Fit Notes</h2>
      <ul className="mt-4 space-y-3">
        {['Athletic and performance pieces fit true to size.', 'Relaxed-fit tees run roomier across the chest.', 'Shoes that feel snug in-store usually break in after a few wears.'].map(
          (n) => (
            <li key={n} className="flex items-start gap-3 text-sm text-neutral-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
              {n}
            </li>
          )
        )}
      </ul>
    </InfoPage>
  );
}
