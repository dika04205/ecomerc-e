'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = ['Board Games', 'Card Games', 'Miniatures', 'Dice & Tokens', 'Accessories'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name: A-Z' },
  { value: 'newest', label: 'Newest' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    params.set('sort', sort);
    params.set('page', page.toString());
    params.set('limit', '12');

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="page-enter" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 className="heading-1" style={{ marginBottom: 'var(--space-sm)' }}>
            {category || 'All'} <span className="text-gradient">Products</span>
          </h1>
          <p className="text-secondary">{total} products found</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-2xl)' }}>
          {/* Sidebar */}
          <aside className="filter-sidebar" id="filter-sidebar">
            {/* Search */}
            <div className="filter-group">
              <h3 className="filter-group-title">Search</h3>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  className="input"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  id="search-input"
                />
              </form>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <h3 className="filter-group-title">Categories</h3>
              <label className={`filter-option ${!category ? 'active' : ''}`}>
                <input
                  type="radio"
                  className="filter-checkbox"
                  checked={!category}
                  onChange={() => { setCategory(''); setPage(1); }}
                />
                All Categories
              </label>
              {CATEGORIES.map(cat => (
                <label key={cat} className={`filter-option ${category === cat ? 'active' : ''}`}>
                  <input
                    type="radio"
                    className="filter-checkbox"
                    checked={category === cat}
                    onChange={() => { setCategory(cat); setPage(1); }}
                  />
                  {cat}
                </label>
              ))}
            </div>

            {/* Sort */}
            <div className="filter-group">
              <h3 className="filter-group-title">Sort By</h3>
              <select
                className="input"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                id="sort-select"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {loading ? (
              <div className="grid grid-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="card" style={{ height: 380 }}>
                    <div className="skeleton" style={{ height: 200 }} />
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="skeleton" style={{ height: 12, width: '60%' }} />
                      <div className="skeleton" style={{ height: 18, width: '80%' }} />
                      <div className="skeleton" style={{ height: 14, width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3 className="empty-state-title">No products found</h3>
                <p className="empty-state-text">Try adjusting your search or filters</p>
                <button className="btn btn-primary" onClick={() => { setSearch(''); setCategory(''); setPage(1); }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-3">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={page <= 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`pagination-btn ${p === page ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
