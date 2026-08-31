import Button from '../../components/common/Button';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-[120px] font-extrabold leading-none text-neutral-200 sm:text-[180px]">
        404
      </p>
      <h1 className="heading-display mt-2 text-3xl sm:text-4xl">Page Not Found</h1>
      <p className="mt-3 max-w-md text-sm text-neutral-500 sm:text-base">
        The page you're looking for doesn't exist or has moved.
      </p>
      <div className="mt-8">
        <Button to="/">Back to Home</Button>
      </div>
    </main>
  );
}
