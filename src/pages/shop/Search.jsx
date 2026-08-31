import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { searchProducts } from '../../data/products';
import { useDebounce } from '../../hooks/useDebounce';
import ProductGrid from '../../components/product/ProductGrid';
import EmptyState from '../../components/common/EmptyState';
import { PackageSearch } from 'lucide-react';

const SUGGESTIONS = ['runner', 'tee', 'jogger', 'sneaker', 'polo', 'pant'];

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);
  const debouncedInput = useDebounce(input, 400);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const results = useMemo(
    () => (debouncedInput ? searchProducts(debouncedInput) : []),
    [debouncedInput]
  );

  const submit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.trim())}`);
    }
  };

  return (
    <main>
      <div className="container-kh py-14 sm:py-20">
        <h1 className="heading-display text-3xl sm:text-4xl">Search</h1>

        <form onSubmit={submit} className="mt-8 flex w-full max-w-2xl items-center gap-3 border-b-2 border-black pb-2">
          <SearchIcon size={22} className="shrink-0 text-neutral-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search shoes, clothing, accessories, sport…"
            className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-neutral-400"
            aria-label="Search products"
            autoFocus
          />
          <button type="submit" className="btn-primary px-6 py-2">
            Search
          </button>
        </form>

        {/* suggestions */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Popular:
          </span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/search?q=${s}`)}
              className="border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:border-black hover:text-black"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {debouncedInput ? (
            <>
              {results.length > 0 ? (
                <>
                  <p className="mb-8 text-sm text-neutral-600">
                    Search results for{' '}
                    <span className="font-bold text-neutral-900">"{debouncedInput}"</span>{' '}
                    ({results.length} {results.length === 1 ? 'result' : 'results'})
                  </p>
                  <ProductGrid products={results} cols={4} />
                </>
              ) : (
                <EmptyState
                  icon={PackageSearch}
                  title="No results found"
                  description={`We couldn't find anything for "${debouncedInput}". Try a different search.`}
                />
              )}
            </>
          ) : (
            <p className="text-sm text-neutral-500">
              Start typing to search the full KhShop collection.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
