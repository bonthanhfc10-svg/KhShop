import Button from '../../components/common/Button';

export default function ServerError() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-[120px] font-extrabold leading-none text-neutral-200 sm:text-[180px]">
        500
      </p>
      <h1 className="heading-display mt-2 text-3xl sm:text-4xl">Something Went Wrong</h1>
      <p className="mt-3 max-w-md text-sm text-neutral-500 sm:text-base">
        An unexpected error occurred. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button to="/">Back to Home</Button>
        <Button to="/shop" variant="secondary">
          Shop Now
        </Button>
      </div>
    </main>
  );
}
