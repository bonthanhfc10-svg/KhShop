export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-neutral-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/logo.svg" alt="KhShop" className="mx-auto h-9 w-auto" />
          <h1 className="heading-display mt-6 text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>
        <div className="border border-neutral-200 bg-white p-7 sm:p-9">{children}</div>
        {footer && (
          <p className="mt-6 text-center text-sm text-neutral-500">{footer}</p>
        )}
      </div>
    </main>
  );
}
