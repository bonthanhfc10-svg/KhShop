import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, PackageSearch, X } from 'lucide-react';
import { useProducts } from '../../../hooks/useProducts';
import ProductGrid from '../../../components/customer/product/ProductGrid';
import EmptyState from '../../../components/common/EmptyState';

const SUGGESTIONS = ['runner', 'tee', 'jogger', 'sneaker', 'polo', 'pant'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // The submitted search value
  const query = searchParams.get('q') || '';

  // Input keeps its own value
  const [input, setInput] = useState(() => query);

  const { products: results, loading } = useProducts(
    query ? 'search' : 'list',
    query ? { query } : {}
  );

  // IMPORTANT:
  // Only initialize the input when the page first receives
  // a search query from the URL.
  useEffect(() => {
    if (query && input === '') {
      setInput(query);
    }
  }, [query]);

  const submit = (e) => {
    e.preventDefault();

    const value = input.trim();

    if (!value) {
      return;
    }

    // Update ONLY the search query.
    // Do not reset the input.
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('q', value);
        return next;
      },
      { replace: false }
    );
  };

  const clearSearch = () => {
    // Clear input only when user explicitly clicks X
    setInput('');

    // Remove q from URL
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('q');
        return next;
      },
      { replace: false }
    );
  };

  const handleSuggestion = (value) => {
    setInput(value);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('q', value);
        return next;
      },
      { replace: false }
    );
  };

  return (
    <main>
      <div className="container-kh py-14 sm:py-20">
        <h1 className="heading-display text-3xl sm:text-4xl">
          Search
        </h1>

        <form
          onSubmit={submit}
          className="mt-8 flex w-full max-w-2xl items-center gap-3 border-b-2 border-black pb-2"
        >
          <SearchIcon
            size={22}
            className="shrink-0 text-neutral-400"
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search shoes, clothing, accessories, sport…"
            className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-neutral-400"
            aria-label="Search products"
            autoFocus
          />

          {input && (
            <button
              type="button"
              onClick={clearSearch}
              className="shrink-0 p-1 text-neutral-400 transition-colors hover:text-black"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}

          <button
            type="submit"
            className="btn-primary shrink-0 px-6 py-2"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Popular:
          </span>

          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              className="border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:border-black hover:text-black"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {loading && query ? (
            <p className="text-sm text-neutral-500">
              Searching...
            </p>
          ) : query ? (
            <>
              {results.length > 0 ? (
                <>
                  <p className="mb-8 text-sm text-neutral-600">
                    Search results for{' '}
                    <span className="font-bold text-neutral-900">
                      "{query}"
                    </span>{' '}
                    ({results.length}{' '}
                    {results.length === 1 ? 'result' : 'results'})
                  </p>

                  <ProductGrid
                    products={results}
                    cols={4}
                    breadcrumbContext={[]}
                  />
                </>
              ) : (
                <EmptyState
                  icon={PackageSearch}
                  title="No results found"
                  description={`We couldn't find anything for "${query}". Try a different search.`}
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