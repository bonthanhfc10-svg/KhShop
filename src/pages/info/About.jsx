import InfoPage from '../../components/info/InfoPage';

const VALUES = [
  {
    title: 'Move. Different.',
    text: 'Every piece is designed with intention — functional, athletic and unapologetically modern.',
  },
  {
    title: 'Built to Last',
    text: 'Premium materials and considered construction mean your KhShop pieces keep up with your pace.',
  },
  {
    title: 'People First',
    text: 'Community, fair practices and effortless shopping are at the core of everything we do.',
  },
];

export default function About() {
  return (
    <InfoPage
      title="About KhShop"
      crumb="About"
      intro="We exist to help you move different. KhShop blends performance engineering with everyday street style — premium activewear, footwear and essentials built for the way you actually live."
    >
      <p className="text-[15px] leading-relaxed text-neutral-700">
        Founded with a simple belief — great design should never compromise on
        comfort or effort. From the track to the city, our collections are
        refined, tested and crafted to keep up with every step you take. We
        sweat the details so you don't have to.
      </p>

      <h2 className="heading-display mt-12 text-2xl">What Drives Us</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div
            key={v.title}
            className="border-t-2 border-neutral-900 pt-4"
          >
            <h3 className="font-display text-base font-extrabold uppercase tracking-wide text-neutral-900">
              {v.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {v.text}
            </p>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}
