import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const offset = (page - 1) * limit;
        const response = await fetch(
          `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`
        );
        const data = await response.json();
        setItems((prev) => [...prev, ...data]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-slate-500">Manage your product catalog</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add product
        </Link>
      </div>

      {/* Grid: 1 column on mobile, 2 on medium, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="group flex flex-row md:flex-col overflow-hidden rounded-xl border bg-white p-3 hover:shadow-md transition-all"
          >
            {/* Image: Fixed size on small, full width on medium+ */}
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg md:h-48 md:w-full">
              <img
                src={p.images?.[0] ?? "https://placehold.co/600x400"}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Content: Flex-1 to fill space on small screens */}
            <div className="flex flex-1 flex-col px-3 md:px-0 md:mt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 md:text-base">
                    {p.title}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {p.category?.name}
                  </p>
                </div>
                <span className="text-sm font-bold text-slate-900 md:text-base">
                  ${p.price}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed md:mt-2 md:text-sm">
                {p.description}
              </p>
            </div>
          </Link>
        ))}

        {/* Skeleton Loader to match the new layout */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-row md:flex-col animate-pulse rounded-xl border p-3 gap-3"
            >
              <div className="h-24 w-24 rounded-lg bg-slate-200 md:h-48 md:w-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-200" />
              </div>
            </div>
          ))}
      </div>

      {/* Load More Button */}
      <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-100">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading}
          className="rounded-full border border-slate-300 bg-white px-8 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
