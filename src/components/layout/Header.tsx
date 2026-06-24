import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { categories } from '../../data/categories';

export default function Header() {
  const [drawer, setDrawer] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const count = useCartStore((s) => s.totalItems());
  const wishes = useWishlistStore((s) => s.items.length);

  function runSearch(e: React.FormEvent) {
    e.preventDefault();
    nav(`/shop?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setQ('');
  }

  return (
    <header className="site-header">
      <div className="announce">
        Free shipping over ₹2,500 &nbsp;·&nbsp; Use code <strong>WELCOME10</strong>
      </div>

      <div className="shell header-inner">
        <nav className="nav desktop-nav">
          <div
            className="shop-trigger"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <NavLink to="/shop">Shop</NavLink>
            {shopOpen && (
              <div className="mega">
                {categories.map((c) => (
                  <div className="mega-col" key={c.slug}>
                    <Link
                      className="mega-head"
                      to={`/shop?category=${encodeURIComponent(c.name)}`}
                      onClick={() => setShopOpen(false)}
                    >
                      {c.name}
                    </Link>
                    {c.subcategories.map((s) => (
                      <Link
                        key={s.slug}
                        className="mega-link"
                        to={`/shop?category=${encodeURIComponent(c.name)}&subcategory=${encodeURIComponent(s.name)}`}
                        onClick={() => setShopOpen(false)}
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/about">About</NavLink>
        </nav>

        <Link className="brand" to="/">LAOBAN</Link>

        <div className="header-actions">
          <button className="header-action" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
            <Search />
          </button>
          <Link className="icon-link hide-mobile" to="/wishlist" aria-label="Wishlist">
            <Heart />{wishes > 0 && <span className="badge">{wishes}</span>}
          </Link>
          <Link className="icon-link" to="/cart" aria-label="Shopping bag">
            <Bag />{count > 0 && <span className="badge">{count}</span>}
          </Link>
          <Link className="icon-link hide-mobile" to="/account" aria-label="Account">
            <User />
          </Link>
          <button className="menu-button" aria-label="Menu" onClick={() => setDrawer(true)}>
            <Bars />
          </button>
        </div>
      </div>

      {searchOpen && (
        <form className="search-bar" onSubmit={runSearch}>
          <div className="shell">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for tees, polos, shirts…"
              aria-label="Search products"
            />
          </div>
        </form>
      )}

      {drawer && (
        <>
          <div className="drawer-scrim" onClick={() => setDrawer(false)} />
          <nav className="drawer">
            <div className="drawer-head">
              <span className="brand">LAOBAN</span>
              <button aria-label="Close menu" onClick={() => setDrawer(false)}><Close /></button>
            </div>
            <Link to="/" className="drawer-link" onClick={() => setDrawer(false)}>Home</Link>
            <Link to="/shop" className="drawer-link" onClick={() => setDrawer(false)}>Shop all</Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/shop?category=${encodeURIComponent(c.name)}`}
                className="drawer-sublink"
                onClick={() => setDrawer(false)}
              >
                {c.name}
              </Link>
            ))}
            <Link to="/about" className="drawer-link" onClick={() => setDrawer(false)}>About</Link>
            <Link to="/account" className="drawer-link" onClick={() => setDrawer(false)}>Account</Link>
            <Link to="/wishlist" className="drawer-link" onClick={() => setDrawer(false)}>Wishlist</Link>
          </nav>
        </>
      )}
    </header>
  );
}

function Search() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>; }
function Bag() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>; }
function Heart() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>; }
function User() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>; }
function Bars() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>; }
function Close() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12" /></svg>; }
